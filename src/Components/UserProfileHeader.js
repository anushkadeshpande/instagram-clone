import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";
import { userDb } from "../firebase";
import firebase from "firebase";
import Modal from "react-modal";
import "./UserProfileHeader.css";

function UserProfileHeader({
  uid,
  user,
  username,
  postsCount,
  followers,
  following,
  mode,
}) {
  const loggedUser = useSelector(selectUser);

  const getFollowStatus = () => {
    // considered followed
    if (loggedUser.following?.includes(uid)) return "Following";
    // if requested
    else if (loggedUser.sentRequests?.includes(uid)) return "Requested";
    // if not already foll
    else return "Follow";
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [dataIds, setDataIds] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [isFollowing, setIsFollowing] = useState(getFollowStatus);

  useEffect(() => {
    setIsFollowing(getFollowStatus);
  }, [uid]);

  useEffect(() => {
    //getting follower/following data
    setModalData([]);
    dataIds?.map((dataId) =>
      userDb
        .doc(dataId)
        .get()
        .then((doc) => setModalData((prevData) => [doc.data(), ...prevData]))
    );
  }, [dataIds]);

  function closeModal() {
    setIsOpen(false);
    setDataIds([]);
  }
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const history = useHistory();
  const sendFollowRequest = () => {
    // not already following, so send a follow request
    if (isFollowing === "Follow") {
      userDb.doc(loggedUser.id).update({
        sentRequests: firebase.firestore.FieldValue.arrayUnion(uid),
      }).then(() => {
        userDb.doc(uid).update({
          followRequests: firebase.firestore.FieldValue.arrayUnion(loggedUser.id),
        });
      })
      
      setIsFollowing("Requested");
    }

    // already sent a request, if clicked, request will be deleted
    else if (isFollowing === "Requested") {
      userDb.doc(uid).update({
        followRequests: firebase.firestore.FieldValue.arrayRemove(
          loggedUser.id
        ),
      });
      userDb.doc(loggedUser.id).update({
        sentRequests: firebase.firestore.FieldValue.arrayRemove(uid),
      });
      setIsFollowing("Follow");
    }
  };

  const unfollowUser = () => {
    // if already following, click and unfollow
    if (isFollowing === "Following") {
      userDb.doc(uid).update({
        followers: firebase.firestore.FieldValue.arrayRemove(loggedUser.id),
      });
      userDb.doc(loggedUser.id).update({
        following: firebase.firestore.FieldValue.arrayRemove(uid),
      });

      setIsFollowing("Follow");
    }
  };

  return (
    <div>
      <div className="userProfile__header">
        <div className="userProfile__header__image">
          <img
            src="http://www.defineinternational.com/wp-content/uploads/2014/06/dummy-profile.png"
            alt=""
          />
        </div>
        <div className="userProfile__header__details">
          <div className="user__data__header">
            <p>{username}</p>
            {mode === "myProfile" || username === loggedUser?.userName ? (
              <button
                onClick={() => {
                  auth.signOut();
                  history.push("/");
                }}
              >
                Log Out
              </button>
            ) : mode === "NotFollowed" ? (
              <button onClick={() => sendFollowRequest()}>{isFollowing}</button>
            ) : (
              <button onClick={() => unfollowUser()}>{isFollowing}</button>
            )}
          </div>

          <div className="user__data">
            <p>
              <strong>{postsCount} </strong> <small>Posts</small>
            </p>
            <p
              onClick={() => {
                setIsOpen(true);
                setDataIds(followers !== 0 ? user.followers : []);
              }}
              style={{ cursor: "pointer" }}
            >
              <strong>{followers} </strong>
              <small>Followers</small>
            </p>
            <p
              onClick={() => {
                setIsOpen(true);
                setDataIds(following !== 0 ? user.following : []);
              }}
              style={{ cursor: "pointer" }}
            >
              <strong>{following} </strong>
              <small>Following</small>
            </p>
          </div>
          {
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Upload your picture"
            >
              <div className="modal-content">
                <button onClick={closeModal}>
                  <ion-icon name="close-outline"></ion-icon>
                </button>
                {modalData?.map((userdata) => (
                  <div className="list-item">
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <p>{userdata?.username}</p>
                    <p>{userdata?.name}</p>
                  </div>
                ))}
              </div>
            </Modal>
          }
          <h3>{user?.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;
