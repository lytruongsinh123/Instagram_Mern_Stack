import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const Home = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    useEffect(() => {
        // Lấy post
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/allpost",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                setData(result.posts);
            });

        // Lấy user
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/getalluser",
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result && result.users) {
                    setUsers(result.users.slice(0, 20));
                }
            });
    }, []);

    const likePost = (id) => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/like",
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    postId: id,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                //   console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const unlikePost = (id) => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/unlike",
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    postId: id,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                //   console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const makeComment = (text, postId) => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/comment",
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    postId,
                    text,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePost = (postid) => {
        fetch(
            `https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/deletepost/${postid}`,
            {
                method: "delete",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.filter((item) => {
                    return item._id !== result._id;
                });
                setData(newData);
            });
    };
    return (
        <div className="home home-flex">
            <div className="bg-decor-blob"></div>
            <div className="bg-decor-dots"></div>
            <div className="bg-decor-wave"></div>

            <div className="container">
                <div className="home-main-col">
                    {data.map((item) => {
                        return (
                            <div className="card home-card" key={item._id}>
                                <h5 style={{ padding: "5px" }}>
                                    <Link
                                        to={
                                            item.postedBy._id !== state._id
                                                ? "/profile/" +
                                                  item.postedBy._id
                                                : "/profile"
                                        }>
                                        {item.postedBy.name}
                                    </Link>{" "}
                                    {item.postedBy._id == state._id && (
                                        <i
                                            className="material-icons"
                                            style={{
                                                float: "right",
                                            }}
                                            onClick={() =>
                                                deletePost(item._id)
                                            }>
                                            delete
                                        </i>
                                    )}
                                </h5>
                                <div className="card-image">
                                    <img src={item.photo} />
                                </div>
                                <div className="card-content">
                                    <i
                                        className="material-icons"
                                        style={{ color: "red" }}>
                                        favorite
                                    </i>
                                    {item.likes.includes(state._id) ? (
                                        <i
                                            className="material-icons"
                                            onClick={() => {
                                                unlikePost(item._id);
                                            }}>
                                            thumb_down
                                        </i>
                                    ) : (
                                        <i
                                            className="material-icons"
                                            onClick={() => {
                                                likePost(item._id);
                                            }}>
                                            thumb_up
                                        </i>
                                    )}

                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    <div className="comment-list">
                                        {item.comments.map((record) => {
                                            return (
                                                <h6 key={record._id}>
                                                    <span
                                                        style={{
                                                            fontWeight: "500",
                                                        }}>
                                                        {record.postedBy.name}
                                                    </span>{" "}
                                                    {record.text}
                                                </h6>
                                            );
                                        })}
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            makeComment(
                                                e.target[0].value,
                                                item._id
                                            );
                                        }}>
                                        <input
                                            type="text"
                                            placeholder="add a comment"
                                        />
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {users.length > 0 && (
                    <div className="user-suggest-section user-suggest-vertical">
                        <div></div>
                        <div className="user-suggest-header">
                            <span className="user-suggest-title">
                                Gợi ý cho bạn
                            </span>
                            <span className="user-suggest-viewall">
                                Xem tất cả
                            </span>
                        </div>
                        <div className="user-suggest-list-vertical">
                            {users.map((user) => (
                                <div
                                    className="user-suggest-item-vertical"
                                    key={user._id}>
                                    <img
                                        className="user-suggest-avatar-vertical"
                                        src={
                                            user.pic ||
                                            "https://i.imgur.com/HeIi0wU.png"
                                        }
                                        alt={user.name || user.email}
                                    />
                                    <div className="user-suggest-info-vertical">
                                        <div className="user-suggest-name-vertical">
                                            {user.name ||
                                                user.email ||
                                                user._id}
                                        </div>
                                        <div className="user-suggest-desc-vertical">
                                            {user.email ? user.email : ""}
                                        </div>
                                    </div>
                                    <button className="user-suggest-follow-vertical">
                                        Theo dõi
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
