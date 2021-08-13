import { useState, useEffect } from 'react'
import Smile from '../smile.svg';
import './Comments.css'
import firebase from 'firebase'
import { db, postDb } from '../firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice';

function Comments({ postId, commentsList }) {
    const user = useSelector(selectUser);
    const [commentInput, setCommentInput] = useState("");
    const [soShowMe, setSee] = useState(false)
    const [c , setC] = useState([])
    useEffect(() => {
        commentsList.map(co => 

            setC(prevState => [...prevState , co.get()])
        )
    },[])
   // commentsList[0]?.get().then((doc) => console.log(doc.data()))
    console.log(c)
    const addComment = (e) => {
        e.preventDefault();

        const commentObj = {
            user: user.userName,
            comment: commentInput
        }

        postDb.doc(`${postId}`).collection('comments')?.add(commentObj).then((docRef) => {
            postDb.doc(`${postId}`).update({
                comments: firebase.firestore.FieldValue.arrayUnion(docRef)
            })
        })

        setCommentInput('')
    }

    return (
        <div style={{ backgroundColor: "#fff" }}>

            <div className="comments__list">
                <p id="show_more" onClick={() => setSee(!soShowMe)}>View all comments...</p>
                {commentsList.map(c =>
                    <p style={soShowMe ? { display: "block" } : { display: "none" }}>
                        <strong>{c.user} </strong> {c.comment}
                    </p>)}
            </div>
            <div className="comments_section">
                <img className="emoji-button" src={Smile} alt="" />
                <input placeholder="Add a comment..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
                <button onClick={(e) => addComment(e)} style={commentInput? {color:"#0094f6"}: {color:"#0094f654"}}>Post</button>
            </div>
        </div>
    )
}

export default Comments
