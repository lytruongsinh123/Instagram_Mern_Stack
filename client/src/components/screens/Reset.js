import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import "../../styles/reset.css";
const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const PostData = () => {
        if (
            !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            )
        ) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
            return;
        }
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/reset-password",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
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
    return (
        <div className="reset-container">
            <div className="reset-title">Instagram</div>
            <form
                className="reset-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    PostData();
                }}>
                <input
                    className="reset-input"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="reset-btn">
                    Reset password
                </button>
            </form>
        </div>
    );
};

export default Reset;
