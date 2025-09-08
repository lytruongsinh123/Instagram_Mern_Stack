const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/health", (req, res) => {
    return res.send("app ok");
});
router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    }
                    res.json({ user, posts });
                });
        })
        .catch((err) => {
            return res.status(404).json({ error: "User not found" });
        });
});
router.get("/user/:id/followers", requireLogin, (req, res) => {
    User.findById(req.params.id)
        .populate("followers", "_id name email pic") // Populate thông tin followers
        .select("followers") // Chỉ lấy trường followers
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ followers: user.followers });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        });
});
router.get("/user/:id/following", requireLogin, (req, res) => {
    User.findById(req.params.id)
        .populate("following", "_id name email pic") // Populate thông tin following
        .select("following") // Chỉ lấy trường following
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ following: user.following });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Something went wrong" });
        });
});
router.get("/getallusernotfollow", requireLogin, (req, res) => {
    if (!req.user || !req.user.following) {
        return res.status(400).json({ error: "Invalid user data" });
    }

    User.find({
        _id: { $nin: [...req.user.following, req.user._id] },
    })
        .select("-password")
        .then((users) => {
            res.json({ users });
        })
        .catch((err) => {
            res.status(500).json({ error: "Something went wrong" });
        });
});


router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $push: { following: req.body.followId },
                },
                { new: true }
            )
                .select("-password")
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        }
    );
});
router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { following: req.body.unfollowId },
                },
                { new: true }
            )
                .select("-password")
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        }
    );
});

router.put("/updatepic", requireLogin, (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        { $set: { pic: req.body.pic } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic canot post" });
            }
            res.json(result);
        }
    );
});

router.post("/search-users", (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    User.find({ email: { $regex: userPattern } })
        .select("_id email")
        .then((user) => {
            res.json({ user });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
