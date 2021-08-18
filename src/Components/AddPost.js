import { useState } from "react";
import Modal from "react-modal";
import "./AddPost.css";
import firebase from "firebase";
import { db, storage, postDb, userDb } from "../firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

function AddPost({ modalIsOpen, setIsOpen }) {
  const user = useSelector(selectUser);
  const [docRef, setDocRef] = useState();
  const [caption, setCaption] = useState("");
  const [pictureUrl, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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

  const upload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        //oncomplete
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            const post = {
              username: user.userName,
              pic: url,
              caption: caption,
              likes: 0,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              comments: [],
              uid: user.id,
            };
            db.collection("posts")
              .add(post)
              .then((doc) =>
                userDb
                  .doc(user.id)
                  .update({
                    posts: firebase.firestore.FieldValue.arrayUnion(doc.id),
                  })
              );
            setProgress(0);
            closeModal();
          });
      }
    );
  };
  const uploadPicture = (e) => {
    e.preventDefault();
    if (pictureUrl === "") upload();
    else {
      const post = {
        username: user.userName,
        pic: pictureUrl,
        caption: caption,
        likes: 0,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        comments: [],
        uid: user.id,
      };
      postDb
        .add(post)
        .then((doc) =>
          userDb
            .doc(user.id)
            .update({ posts: firebase.firestore.FieldValue.arrayUnion(doc.id) })
        );
      closeModal();
    }
    //closeModal();
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Upload your picture"
      >
        <button id="closeButton" onClick={closeModal}>
          <ion-icon name="close-circle-outline"></ion-icon>
        </button>
        <form className="upload__form" onSubmit={uploadPicture}>
          <h3 style={{ background: "#fff" }} className="headings">
            Upload your picture:
          </h3>
          <input
            id="file_uploadButton"
            type="file"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <progress className="progressBar" value={progress} max="100" />
          <div className="or__separator">
            <div className="line"></div>
            <span className="or__text">OR</span>
            <div className="line"></div>
          </div>
          <input
            placeholder="Image URL"
            className="inputField"
            value={pictureUrl}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <h3 style={{ background: "#fff" }} className="headings">
            Enter image caption:
          </h3>
          <input
            placeholder="Caption"
            className="inputField"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          <button className="upload_button" type="submit">
            Upload
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AddPost;
