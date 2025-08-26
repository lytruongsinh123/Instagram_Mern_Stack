import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import "../../styles/signin.css";
const SignIn = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [password, setPasword] = useState("");
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
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/signin",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    email,
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
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user });
                    M.toast({
                        html: "signedin success",
                        classes: "#43a047 green darken-1",
                    });
                    history.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="signin-container">
            <div className="signin-title">Instagram</div>
            <form
                className="signin-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    PostData();
                }}>
                <input
                    className="signin-input"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="signin-input"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPasword(e.target.value)}
                />
                <button type="submit" className="signin-btn">
                    Login
                </button>
            </form>
            <a className="signin-link" href="/signup">
                Don't have an account?
            </a>
            <a className="signin-link" href="/reset">
                Forgot password?
            </a>
        </div>
    );
};

export default SignIn;
