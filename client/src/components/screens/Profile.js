import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "../../styles/profile.css";

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    useEffect(() => {
        fetch("https://hung-instagram.onrender.com/mypost", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setPics(result.mypost);
            });
    }, []);
    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dquqnld1p");
            fetch("https://api.cloudinary.com/v1_1/dquqnld1p/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    fetch("https://hung-instagram.onrender.com/updatepic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                "Bearer " + localStorage.getItem("jwt"),
                        },
                        body: JSON.stringify({
                            pic: data.url,
                        }),
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            console.log(result);
                            localStorage.setItem(
                                "user",
                                JSON.stringify({ ...state, pic: result.pic })
                            );
                            dispatch({
                                type: "UPDATEPIC",
                                payload: result.pic,
                            });
                            //window.location.reload()
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [image]);
    const updatePhoto = (file) => {
        setImage(file);
    };
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <img
                        className="profile-avatar"
                        src={state ? state.pic : "loading"}
                        alt="avatar"
                    />
                    <div className="profile-upload">
                        <label className="btn">
                            Update pic
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                        </label>
                    </div>
                </div>
                <div className="profile-info">
                    <h4>{state ? state.name : "loading"}</h4>
                    <h5>{state ? state.email : "loading"}</h5>
                    <div className="profile-stats">
                        <h6>{mypics.length} posts</h6>
                        <h6>
                            {state ? state.followers.length : "0"} followers
                        </h6>
                        <h6>
                            {state ? state.following.length : "0"} following
                        </h6>
                    </div>
                </div>
            </div>
            <div className="profile-gallery">
                {mypics.map((item) => (
                    <img
                        key={item._id}
                        className="item"
                        src={item.photo}
                        alt={item.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default Profile;
