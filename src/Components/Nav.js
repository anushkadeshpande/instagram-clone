import React, { useState } from "react";
import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

function Nav() {
  const [searchBox, setSearchBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const user = useSelector(selectUser);

  return (
    <div className="navbar">
      <div className="nav">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          alt=""
        />
        <div className="search_area">
          <div className="search_area_input">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => {
                setSearchBox(!searchBox);
              }}
              className="nav__search"
              type="text"
              placeholder="Search"
            />
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchBox(false);
              }}
              style={searchBox ? { display: "block" } : { display: "none" }}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          {searchBox ? <Search searchTerm={searchTerm.toLowerCase()} /> : ""}
        </div>
        <div className="nav__buttons">
          <Link to="/home">
            <ion-icon
              name={location.pathname === "/home" ? "home" : "home-outline"}
            ></ion-icon>
          </Link>

          <Link to="/notifications">
          <>
            <ion-icon
              name={
                location.pathname === "/notifications"
                  ? "heart"
                  : "heart-outline"
              }
            ></ion-icon>
            <div className="dot" style={user?.followRequests?.length === 0?{display:"none"}:{display:"block"}}></div>
          </>
          </Link>
          <Link to="/me">
            <ion-icon
              name={
                location.pathname === "/me"
                  ? "person-circle"
                  : "person-circle-outline"
              }
            ></ion-icon>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
