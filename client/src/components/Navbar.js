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
                    <button
                        data-target="modal1"
                        className="modal-trigger navbar-link navbar-btn-reset"
                        tabIndex={0}>
                        <i className="material-icons navbar-icon">search</i>
                        <span className="navbar-link-label">Search</span>
                    </button>
                </li>,
                <li key="2">
                    <Link to="/profile" className="navbar-link">
                        <i className="material-icons navbar-icon">
                            account_circle
                        </i>
                        <span className="navbar-link-label">Profile</span>
                    </Link>
                </li>,
                <li key="3">
                    <Link to="/create" className="navbar-link">
                        <i className="material-icons navbar-icon">add_box</i>
                        <span className="navbar-link-label">Create Post</span>
                    </Link>
                </li>,
                <li key="4">
                    <Link to="/myfollowingpost" className="navbar-link">
                        <i className="material-icons navbar-icon">
                            dynamic_feed
                        </i>
                        <span className="navbar-link-label">
                            My following Posts
                        </span>
                    </Link>
                </li>,
                <li key="5">
                    <button
                        className="navbar-logout-btn navbar-link"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            history.push("/signin");
                        }}>
                        <i className="material-icons navbar-icon">logout</i>
                        <span className="navbar-link-label">Logout</span>
                    </button>
                </li>,
            ];
        } else {
            return [
                <li key="6">
                    <Link to="/signin" className="navbar-link">
                        <i className="material-icons navbar-icon">login</i>
                        <span className="navbar-link-label">Sign In</span>
                    </Link>
                </li>,
                <li key="7">
                    <Link to="/signup" className="navbar-link">
                        <i className="material-icons navbar-icon">person_add</i>
                        <span className="navbar-link-label">Sign Up</span>
                    </Link>
                </li>,
            ];
        }
    };

    const fetchUsers = (query) => {
        setSearch(query);
        fetch(
            "https://hunginstagram-cjfqgug2gzdng5bs.koreacentral-01.azurewebsites.net/search-users",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                }),
            }
        )
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
