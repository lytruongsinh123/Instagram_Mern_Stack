import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import "../../styles/signup.css";
const SignIn = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPasword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);
    const uploadPic = () => {
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
    const uploadFields = () => {
        if (
            !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
            return;
        }
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/signup",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    password,
                    email,
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
                        html: data.message,
                        classes: "#43a047 green darken-1",
                    });
                    history.push("/signin");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const PostData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-title">Instagram</div>
            <form
                className="signup-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    PostData();
                }}>
                <input
                    className="signup-input"
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="signup-input"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="signup-input"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)}
                />
                <div className="signup-upload">
                    <label className="signup-upload-btn">
                        Upload pic
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </label>
                    <input
                        className="file-path"
                        type="text"
                        value={image && image.name ? image.name : ""}
                        readOnly
                        placeholder="No file chosen"
                    />
                </div>
                <button type="submit" className="signup-btn">
                    Sign Up
                </button>
            </form>
            <a className="signup-link" href="/signin">
                Already have an account?
            </a>
        </div>
    );
};

export default SignIn;
