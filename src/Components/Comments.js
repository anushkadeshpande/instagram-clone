import { useState } from "react";
import Smile from "../smile.svg";
import "./Comments.css";
import firebase from "firebase";
import { postDb } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function Comments({ postId, comments }) {
  const user = useSelector(selectUser);
  const [commentInput, setCommentInput] = useState("");
  const [soShowMe, setSee] = useState(false);

  const addComment = (e) => {
    e.preventDefault();

    postDb.doc(postId).update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        sender: user.userName,
        comment: commentInput,
      }),
    });

    setCommentInput("");
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="comments__list">
        <p
          style={
            comments?.length > 2 ? { display: "block" } : { display: "none" }
          }
          id="show_more"
          onClick={() => setSee(!soShowMe)}
        >
          View all comments...
        </p>
        {comments?.map((comment, index) =>
          index === 0 || index === 1 ? (
            <p>
              <strong>{comment?.sender} </strong> {comment?.comment}
            </p>
          ) : (
            <p style={soShowMe ? { display: "block" } : { display: "none" }}>
              <strong>{comment?.sender} </strong> {comment?.comment}
            </p>
          )
        )}
      </div>

      <div className="comments_section">
        <img className="emoji-button" src={Smile} alt="" />
        <input
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          onClick={(e) => addComment(e)}
          style={
            commentInput !== "" ? { color: "#0094f6" } : { color: "#0094f654" }
          }
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default Comments;
