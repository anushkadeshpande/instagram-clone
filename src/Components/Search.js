import React, { useState, useEffect } from "react";
import "./Search.css";
import { userDb } from "../firebase";

import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import { setSearch } from "../features/searchSlice";

function Search({ searchTerm }) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [profileClicked, setProfileClicked] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  useEffect(() => {
    userDb.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsers((prevData) => [...prevData, { id: doc.id, data: doc.data() }]);
      });
    });
  }, []);
  useEffect(() => {
    setFoundUsers([]);
    if (searchTerm === "") {
      setFoundUsers([]);
    } else {
      users.map((user) => {
        if (user.data.username.toLowerCase().includes(searchTerm)) {
          setFoundUsers((prevState) => [...prevState, user]);
        }
      });
    }
  }, [searchTerm]);

  return (
    <div className={!profileClicked ? "search_box" : "search_box_hidden"}>
      {foundUsers.map((foundUser) => (
        <div
          className="foundItem"
          key={foundUser.data.username}
          onClick={() => {
            setProfileClicked(true);
            dispatch(setSearch(foundUser));
          }}
        >
          {foundUser.data.username}
        </div>
      ))}
      {profileClicked ? <Redirect to="/user" /> : ""}
    </div>
  );
}

export default Search;
