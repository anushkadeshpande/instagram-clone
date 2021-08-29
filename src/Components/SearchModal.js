import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { userDb } from "../firebase";

import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import { setSearch } from "../features/searchSlice";

function SearchModal({ searchModalIsOpen, setSearchOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
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
        if (user.data.username.toLowerCase().includes(searchTerm.toLowerCase())) {
          setFoundUsers((prevState) => [...prevState, user]);
        }
      });
    }
  }, [searchTerm]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "400px",
    },
  };
  function closeModal() {
    setSearchOpen(false);
  }
  return (
    <div>
      <Modal
        isOpen={searchModalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Upload your picture"
      >
        <button id="closeButton" onClick={closeModal}>
          <ion-icon name="close-circle-outline"></ion-icon>
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="foundUsers">
          {foundUsers.map((user) => (
            <p
              key={user.data.username}
              onClick={() => {
                setProfileClicked(true);
                dispatch(setSearch(user));
              }}
            >
              {user.data.username}
            </p>
          ))}
          {profileClicked ? <Redirect to="/user" /> : ""}
        </div>
      </Modal>
    </div>
  );
}

export default SearchModal;
