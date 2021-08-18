import React, { useState, useEffect } from "react";
import "./Post.css";
import firebase from "firebase";
import PictureButtons from "./PictureButtons";
import { postDb } from "../firebase";
import Comments from "./Comments";

function Post({
  id,
  username,
  pictureUrl,
  caption,
  likes,
  comments,
  likedStatus,
}) {
  return (
    <div className="picture">
      <div className="picture__header">
        <div className="picture__header__left">
          <ion-icon
            style={{ background: "#fff" }}
            name="person-circle-outline"
          ></ion-icon>
          <h4 style={{ background: "#fff" }}>{username}</h4>
        </div>
      </div>

      <div className="picture__picture">
        <img src={pictureUrl} alt="" />
      </div>

      <PictureButtons id={id} likes={likes} likedStatus={likedStatus} />

      <div className="picture__data">
        <p>
          <strong>{likes} likes</strong>
        </p>
        <p>
          <strong>{username}</strong> {caption}
        </p>
      </div>

      <Comments postId={id} comments={comments} />
    </div>
  );
}

export default Post;
