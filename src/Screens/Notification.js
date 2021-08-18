import React, { useState, useEffect } from "react";
import "./Notification.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { userDb } from "../firebase";
import firebase from "firebase";
function Notification() {
  const user = useSelector(selectUser);
  if (!user) window.location = "/";
  const [receivedRequests, setRecievedRequests] = useState([]);
  useEffect(() => {
    user?.followRequests?.map((followRequest) => {
      userDb
        .doc(followRequest)
        ?.get()
        .then((doc) => {
          setRecievedRequests((prevData) => [
            { id: doc.id, data: doc.data() },
            ...prevData,
          ]);
        });
    });
  }, []);
  const deleteRequest = (id) => {
    userDb.doc(id).update({
      sentRequests: firebase.firestore.FieldValue.arrayRemove(user.id),
    });

    userDb.doc(user.id).update({
      followRequests: firebase.firestore.FieldValue.arrayRemove(id),
    });
  };
  const acceptRequest = (id) => {
    userDb.doc(id).update({
      following: firebase.firestore.FieldValue.arrayUnion(user.id),
      sentRequests: firebase.firestore.FieldValue.arrayRemove(user.id),
    });

    userDb.doc(user.id).update({
      followers: firebase.firestore.FieldValue.arrayUnion(id),
      followRequests: firebase.firestore.FieldValue.arrayRemove(id),
    });
  };

  return (
    <div className="notifications__page">
      {user.followRequests.length === 0 ? (
        <div className="clear_page">
          <ion-icon
            name="checkmark-circle-outline"
            style={{ fontSize: "12vh" }}
          ></ion-icon>
          <div className="page_text">
            <p style={{ fontSize: "10vh" }}>You are up to date</p>
            <p style={{ fontSize: "4vh" }}>No pending requests</p>
          </div>
        </div>
      ) : (
        receivedRequests.map((req) => (
          <div className="requests">
            <img
              src="http://www.defineinternational.com/wp-content/uploads/2014/06/dummy-profile.png"
              alt=""
            />
            <p>
              <strong>{req.data.username} </strong>({req.data.name}) has
              requested to follow you.
            </p>
            <button
              onClick={() => {
                acceptRequest(req.id);
              }}
            >
              <ion-icon name="checkmark-circle"></ion-icon>
            </button>
            <button
              onClick={() => {
                deleteRequest(req.id);
              }}
            >
              <ion-icon name="trash"></ion-icon>
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Notification;
