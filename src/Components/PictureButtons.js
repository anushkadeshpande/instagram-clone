import React, { useState } from "react";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./PictureButtons.css";
import { postDb, userDb } from "../firebase";

function PictureButtons({ id, likes, likedStatus, blockLikes }) {
  console.log(id, likes, likedStatus)
  const user = useSelector(selectUser);

  const [like, setLike] = useState(likedStatus);

  const handleLikes = () => {
    if(blockLikes){}
    else{
    console.log("Updating likess")
    if (like) {
      setLike(false);
      postDb.doc(id).update({ likes: likes - 1 });
      userDb
        .doc(user.id)
        .update({ likedPosts: firebase.firestore.FieldValue.arrayRemove(id) });
    } else {
      setLike(true);
      postDb.doc(id).update({ likes: likes + 1 });
      userDb
        .doc(user.id)
        .update({ likedPosts: firebase.firestore.FieldValue.arrayUnion(id) });
    }
  }
  };

  return (
    <div className="picture__buttons">
      <ion-icon
        name={like ? "heart" : "heart-outline"}
        style={like ? { color: "#ff0000" } : { color: "#000" }}
        onClick={() => handleLikes()}
      ></ion-icon>
      <ion-icon name="chatbubble-outline"></ion-icon>
      <ion-icon name="send-outline"></ion-icon>
    </div>
  );
}

export default PictureButtons;
