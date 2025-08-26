import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import "../../styles/newpassword.css";
const NewPassword = () => {
    const history = useHistory();
    const [password, setPasword] = useState("");
    const { token } = useParams();
    console.log(token);
    const PostData = () => {
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/new-password",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    token,
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
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
        <div className="newpassword-container">
            <div className="newpassword-title">Instagram</div>
            <form
                className="newpassword-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    PostData();
                }}>
                <input
                    className="newpassword-input"
                    type="password"
                    placeholder="Enter a new password"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)}
                />
                <button type="submit" className="newpassword-btn">
                    Update password
                </button>
            </form>
        </div>
    );
};

export default NewPassword;
