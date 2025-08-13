import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import "../styles/navbar.css";
const NavBar = () => {
    const searchModal = useRef(null);
    const [search, setSearch] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);
    const renderList = () => {
        if (state) {
            return [
                <li key="1">
                    <i
                        data-target="modal1"
                        className="large material-icons modal-trigger"
                        style={{ color: "black" }}>
                        search
                    </i>
                </li>,
                <li key="2">
                    <Link to="/profile">Profile</Link>
                </li>,
                <li key="3">
                    <Link to="/create">Create Post</Link>
                </li>,
                <li key="4">
                    <Link to="/myfollowingpost">My following Posts</Link>
                </li>,
                <li key="5">
                    <button
                        className="navbar-logout-btn"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            history.push("/signin");
                        }}>
                        Logout
                    </button>
                </li>,
            ];
        } else {
            return [
                <li key="6">
                    <Link to="/signin">Signin</Link>
                </li>,
                <li key="7">
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
    };

    const fetchUsers = (query) => {
        setSearch(query);
        fetch("https://hung-instagram.onrender.com/search-users", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
            }),
        })
            .then((res) => res.json())
            .then((results) => {
                setUserDetails(results.user);
            });
    };
    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <Link to={state ? "/" : "/signin"} className="navbar-logo">
                    Instagram
                </Link>
                <ul className="navbar-links">
                    {renderList().map((item, idx) => {
                        // Nếu là <Link> thì thêm class navbar-link
                        if (item && item.type === Link) {
                            return React.cloneElement(item, {
                                className:
                                    (item.props.className
                                        ? item.props.className + " "
                                        : "") + "navbar-link",
                                key: item.key || idx,
                            });
                        }
                        // Nếu là <button> thì thêm class navbar-link cho đồng bộ
                        if (item && item.type === "button") {
                            return React.cloneElement(item, {
                                className:
                                    (item.props.className
                                        ? item.props.className + " "
                                        : "") + "navbar-link",
                                key: item.key || idx,
                            });
                        }
                        // Nếu là icon search
                        if (item && item.type === "li") {
                            return React.cloneElement(item, {
                                key: item.key || idx,
                            });
                        }
                        return item;
                    })}
                </ul>
            </div>
            <div
                id="modal1"
                className="modal"
                ref={searchModal}
                style={{ color: "black" }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map((item) => {
                            return (
                                <Link
                                    to={
                                        item._id !== state._id
                                            ? "/profile/" + item._id
                                            : "/profile"
                                    }
                                    onClick={() => {
                                        M.Modal.getInstance(
                                            searchModal.current
                                        ).close();
                                        setSearch("");
                                    }}>
                                    <li className="collection-item">
                                        {item.email}
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-green btn-flat"
                        onClick={() => setSearch("")}>
                        close
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
