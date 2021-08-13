import React, { useState } from 'react'
import "./Post.css"
import firebase from 'firebase'
import { db, postDb, userDb, storage } from '../firebase'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from "react-redux";
import { selectUser } from '../features/userSlice';
//import Comments from './Comments'

function Post({ id, username, pictureUrl, caption, likes, comments, likedStatus }) {
  const user = useSelector(selectUser);
  const [like, setLike] = useState(likedStatus);
  // const [likeCount, setCount] = useState(likes);
  const [menuActive, setMenu] = useState(false);
  //console.log(comments)
  const handleLikes = () => {
    if (like) {
      setLike(false)
      postDb.doc(id).update({ likes: likes - 1 })
      userDb.doc(user.id).update({ likedPosts: firebase.firestore.FieldValue.arrayRemove(id) })
    }
    else {
      setLike(true)
      postDb.doc(id).update({ likes: likes + 1 })
      userDb.doc(user.id).update({ likedPosts: firebase.firestore.FieldValue.arrayUnion(id) })
    }
  }
  const deletePost = () => {
    if (pictureUrl.startsWith("https://firebasestorage.googleapis.com/v0/b/instagram-4.appspot.com")) {
      storage.refFromURL(pictureUrl).delete()
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


  }
  return (
    <div>
      <div className="picture">

        <div className="picture__header">
          <div className="picture__header__left">
            <ion-icon style={{ background: "#fff" }} name="person-circle-outline"></ion-icon>
            <h4 style={{ background: "#fff" }}>{username}</h4>
          </div>
          <div className="menu">
            <MoreVertIcon style={username === user?.userName ? { display: "block" } : { display: "none" }} className="menu_button" onClick={() => { setMenu(!menuActive) }} />
            {
              menuActive ?
                <div className="menu__box">
                  <button className="delete__button" onClick={() => { deletePost() }}>Delete Post</button>
                </div>
                : ''
            }
          </div>
        </div>


        <div className="picture__picture">
          <img src={pictureUrl} alt="" />
        </div>


        <div className="picture__buttons">
          <ion-icon name={like ? "heart" : "heart-outline"} style={like ? { color: "#ff0000" } : { color: "#000" }} onClick={handleLikes}></ion-icon>
          <ion-icon name="chatbubble-outline"></ion-icon>
          <ion-icon name="send-outline"></ion-icon>
        </div>


        <div className="picture__data">
          <p><strong>{likes} likes</strong></p>
          <p><strong>{username}</strong> {caption}</p>
        </div>
        {/*<Comments postId={id} commentsList={comments}/>*/}
      </div>
    </div>
  )
}

export default Post
