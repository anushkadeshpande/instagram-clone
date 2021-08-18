import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./PostModal.css";
import firebase from "firebase"
import PictureButtons from "./PictureButtons";
import { postDb, userDb } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import Smile from "../smile.svg";

function PostModal({ modalIsOpen, setIsOpen, modalPost, setModalPost }) {
  const user = useSelector(selectUser);
  const [postLike, setPostLike] = useState(
    user?.likedPosts?.includes(modalPost.id)
  );
  const [commentInput, setCommentInput] = useState("");
  const addComment = () => {postDb.doc(modalPost.id).update({
    comments: firebase.firestore.FieldValue.arrayUnion({ sender: user.userName,
      comment: commentInput}),
  })

setCommentInput("");};
  useEffect(() => {
    setPostLike(user?.likedPosts?.includes(modalPost.id));
  }, [user?.likedPost]);
  console.log(user?.likedPosts?.includes(modalPost.id));
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
  /* const deletePost = () => {
if (modalPost.pic.startsWith("https://firebasestorage.googleapis.com/v0/b/instagram-4.appspot.com")) {
    storage.refFromURL(modalPost.pic).delete()
  }
  user.likedPosts?.map(likedPost => {
    console.log("liked:" , likedPost, "to match: ", id)
    if (likedPost === id)
      userDb.doc(user.id).update({ likedPosts: firebase.firestore.FieldValue.arrayRemove(id) })
  })
  user.posts?.map(post => {
    console.log("post:" , post, "to match: ", id)
    if (post === id)
      userDb.doc(user.id).update({ posts: firebase.firestore.FieldValue.arrayRemove(id) })
  })
  postDb.doc(id).delete()

    //  console.log(modalPost);
  };*/
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
              <button>
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
              <PictureButtons
                id={modalPost.id}
                likes={modalPost.post.likes}
                likedStatus={postLike}
              />
              <p>
                {postLike ? modalPost.post.likes + 1 : modalPost.post.likes}{" "}
                likes
              </p>
            </div>
            <div className="separator"></div>
            {console.log(modalPost)}
            <div className="post-info__comments">
              <p>
                {modalPost.post.comments?.map((comment) => (
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
