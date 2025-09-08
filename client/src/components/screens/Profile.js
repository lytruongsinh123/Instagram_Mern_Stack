import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "../../styles/profile.css";
import "../../styles/modal.css";
import Modal from "react-modal";

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    const [followers, setFollowers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/mypost",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
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
                    fetch(
                        "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/updatepic",
                        {
                            method: "put",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization:
                                    "Bearer " + localStorage.getItem("jwt"),
                            },
                            body: JSON.stringify({
                                pic: data.url,
                            }),
                        }
                    )
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
    const fetchFollowers = () => {
        fetch(`https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/user/${state._id}/followers`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setFollowers(result.followers);
                setIsModalOpen(true);
            });
    };
    const fetchFollowing = () => {
        fetch(`https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/user/${state._id}/following`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setFollowers(result.following);
                setIsModalOpen(true);
            });
    };
    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
    };
    return (
        <>
            {" "}
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
                                    onChange={(e) =>
                                        updatePhoto(e.target.files[0])
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div className="profile-stats">
                            <h6>{mypics.length} posts</h6>
                            <h6
                                style={{ cursor: "pointer" }}
                                onClick={fetchFollowers}>
                                {state ? state.followers.length : "0"} followers
                            </h6>
                            <h6
                                style={{ cursor: "pointer" }}
                                onClick={fetchFollowing}>
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
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Followers Modal">
                <h2>Followers</h2>
                <button onClick={closeModal} className="close-modal-btn">
                    Close
                </button>
                <ul>
                    {Array.isArray(followers) && followers.length > 0 ? (
                        followers.map((follower) => (
                            <li key={follower._id}>
                                <img src={follower.pic} alt={follower.name} />
                                <div className="follower-info">
                                    <span className="follower-name">
                                        {follower.name}
                                    </span>
                                    <span className="follower-email">
                                        <i
                                            className="fa fa-envelope"
                                            style={{
                                                marginRight: "6px",
                                                color: "#ff7e5f",
                                            }}></i>
                                        {follower.email}
                                    </span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No followers found</p>
                    )}
                </ul>
            </Modal>
        </>
    );
};

export default Profile;
