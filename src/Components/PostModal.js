import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./PostModal.css";
import firebase from "firebase";
import PictureButtons from "./PictureButtons";
import { postDb, userDb, storage } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import Smile from "../smile.svg";



function PostModal({ modalIsOpen, setIsOpen, modalPost, setModalPost }) {
  const user = useSelector(selectUser);
  const [likes, setLikes] = useState(modalPost.post.likes)
  const [postLike, setPostLike] = useState(
    user?.likedPosts?.includes(modalPost.id)
  );

  const [commentInput, setCommentInput] = useState("");
  const [previousPostLike,setPreviousPostLike] = useState(!postLike);
  const addComment = () => {
    postDb.doc(modalPost.id).update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        sender: user.userName,
        comment: commentInput,
      }),
    });
    setCommentInput("");
  };

  const [postComments, setPostComments] = useState([])
  useEffect(() => {
    //setPostLike(user?.likedPosts?.includes(modalPost.id));
    postDb.where(firebase.firestore.FieldPath.documentId(), '==', modalPost.id).onSnapshot((snapshot) => {
        setPostComments(
          snapshot.docs.map((doc) => ({
            comments: doc.data().comments
          }))
        )
      
    });
  }, [user?.postComments]);



  const getLikes = () => {
    postDb.where(firebase.firestore.FieldPath.documentId(), '==', modalPost.id).onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => setLikes(doc.data().likes))

  console.log("Like status changed")
  });
}

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      height: "75%",
      width: "80%",
      overflow: "hidden",
      alignItems: "center",
    },
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalPost({});
  };
  
  const deletePost = () => {
    if (
      modalPost.post.pic.startsWith(
        "https://firebasestorage.googleapis.com/v0/b/instagram-4.appspot.com"
      )
    ) {
      console.log(modalPost.post.pic)
      storage.refFromURL(modalPost.post.pic).delete();
    }
    user.likedPosts?.map((likedPost) => {
      if (likedPost === modalPost.id)
        userDb
          .doc(user.id)
          .update({
            likedPosts: firebase.firestore.FieldValue.arrayRemove(modalPost.id),
          });
    });

    user.posts?.map((post) => {
      if (post === modalPost.id)
        userDb
          .doc(user.id)
          .update({
            posts: firebase.firestore.FieldValue.arrayRemove(modalPost.id),
          });
    });
    postDb.doc(modalPost.id).delete();
    
    closeModal();
    window.alert("Post deleted Successfully....")
  };
  
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="post-modal">
          <button id="close-button" onClick={closeModal}>
            <ion-icon name="close"></ion-icon>
          </button>
          {/*  <MoreVertIcon style={{ display: "block" } } className="menu_button" onClick={() => { setMenu(!menuActive) }} />*/}
          <div className="image-container">
            <img className="modal-image" src={modalPost.post.pic} alt="" />
          </div>

          <div className="post-info">
            <div className="post-info__head">
              <ion-icon
                style={{ background: "#fff" }}
                name="person-circle-outline"
              ></ion-icon>
              <p>
                <strong>{modalPost.post.username} </strong>
              </p>
              <button
                style={
                  modalPost.post.uid === user.id
                    ? { display: "block" }
                    : { display: "none" }
                }
                onClick={() => deletePost()}
              >
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
            <div className="separator"></div>
            <div className="post-info__caption">
              <ion-icon
                style={{ background: "#fff" }}
                name="person-circle-outline"
              ></ion-icon>
              <p>
                <strong>{modalPost.post.username} </strong>
                {modalPost.post.caption}
              </p>
            </div>
                
            <div className="post-info__buttons">         
              <p>
                {getLikes()}{likes}{" "}
                likes
              </p>
              {console.log(modalPost)}
            </div>
            <div className="separator"></div>

            <div className="post-info__comments">
              <p>
                {postComments[0]?.comments?.map((comment) => (
                  
                  <p>
                    <strong>{comment.sender} </strong>
                    {comment.comment}
                  </p>
                ))}
              </p>
            </div>
            <div className="post-info__commentsInput">
              <img className="emoji-button" src={Smile} alt="" />
              <input
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                onClick={(e) => addComment(e)}
                style={
                  commentInput !== ""
                    ? { color: "#0094f6" }
                    : { color: "#0094f654" }
                }
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostModal;

