import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import "../../styles/userprofile.css";
import "../../styles/modal.css";
import Modal from "react-modal";

const Profile = () => {
    const [userProfile, setProfile] = useState(null);

    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showfollow, setShowFollow] = useState(
        state ? !state.following.includes(userid) : true
    );
    const [followers, setFollowers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetch(
            `https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/user/${userid}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                //console.log(result)

                setProfile(result);
            });
    }, []);
    const fetchFollowers = () => {
        fetch(
            `https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/user/${userid}/followers`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                setFollowers(result.followers);
                setIsModalOpen(true);
            });
    };
    const fetchFollowing = () => {
        fetch(
            `https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/user/${userid}/following`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                setFollowers(result.following);
                setIsModalOpen(true);
            });
    };
    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
    };
    const followUser = () => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/follow",
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    followId: userid,
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id],
                        },
                    };
                });
                setShowFollow(false);
            });
    };
    const unfollowUser = () => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/unfollow",
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    unfollowId: userid,
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(
                        (item) => item != data._id
                    );
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower,
                        },
                    };
                });
                setShowFollow(true);
            });
    };
    return (
        <>
            {userProfile ? (
                <div className="userprofile-container">
                    <div className="userprofile-header">
                        <div>
                            <img
                                className="userprofile-avatar"
                                src={userProfile.user.pic}
                                alt={userProfile.user.name}
                            />
                        </div>
                        <div className="userprofile-info">
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className="userprofile-stats">
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6
                                    style={{ cursor: "pointer" }}
                                    onClick={fetchFollowers}>
                                    {userProfile.user.followers.length}{" "}
                                    followers
                                </h6>
                                <h6
                                    style={{ cursor: "pointer" }}
                                    onClick={fetchFollowing}>
                                    {userProfile.user.following.length}{" "}
                                    following
                                </h6>
                            </div>
                            <div className="userprofile-action">
                                {showfollow ? (
                                    <button
                                        className="btn waves-effect waves-light userprofile-btn"
                                        onClick={() => followUser()}>
                                        Follow
                                    </button>
                                ) : (
                                    <button
                                        className="btn waves-effect waves-light userprofile-btn"
                                        onClick={() => unfollowUser()}>
                                        UnFollow
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="userprofile-gallery">
                        {userProfile.posts.map((item) => {
                            return (
                                <img
                                    key={item._id}
                                    className="item"
                                    src={item.photo}
                                    alt={item.title}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : (
                <h2>loading...!</h2>
            )}

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
