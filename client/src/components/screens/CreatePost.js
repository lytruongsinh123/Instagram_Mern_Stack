import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import "../../styles/creatpost.css";

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (url) {
            fetch(
                "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/createpost",
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("jwt"),
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        pic: url,
                    }),
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        M.toast({
                            html: data.error,
                            classes: "#c62828 red darken-3",
                        });
                    } else {
                        M.toast({
                            html: "Created post Successfully",
                            classes: "#43a047 green darken-1",
                        });
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [url]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "new-insta");
        data.append("cloud_name", "dquqnld1p");
        fetch("https://api.cloudinary.com/v1_1/dquqnld1p/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setUrl(data.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="createpost-container">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="body-input"
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn" onClick={postDetails} type="button">
                Submit post
            </button>
        </div>
    );
};

export default CreatePost;
