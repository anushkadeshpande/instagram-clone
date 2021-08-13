import { useState, useEffect } from 'react'
import { db,postDb } from '../firebase'
import { useDispatch, useSelector } from "react-redux";
import { setPosts, selectPosts } from '../features/postSlice'; 
import { selectUser } from '../features/userSlice';
import Post from '../Components/Post'
import AddPost from '../Components/AddPost';

import './Home.css'

function Home() {
    
  //  const [posts, setPosts] = useState([])
    const user = useSelector(selectUser);
    const [modalIsOpen, setIsOpen] = useState(false);
    const posts = useSelector(selectPosts);
    const dispatch = useDispatch();
    if(!user)
    window.location = '/'
    const openModal = () => setIsOpen(true);

    useEffect(() => {
        postDb.orderBy("timeStamp", "desc").onSnapshot(snapshot => {
            dispatch(setPosts(snapshot.docs.map(doc =>
            ({
                id: doc.id,
                username : doc.data().username,
                likes: doc.data().likes,
                caption: doc.data().caption,
                pic: doc.data().pic,
                timeStamp: doc.data().timeStamp?.seconds
                //data: doc.data(),
                //we need to first resolve the comments before putting them in redux
                // need to figure out
                // explore redux-firebse 
               // comments: doc.data().comments
            })
            )))
        })
        // setting comments
      /*  const commentsSetUp = (doc, id) => {
            // console.log("Setting up comments again")
            let co = []
            doc.data().comments?.map(c => postDb.doc(`${id}`)
                .collection('comments')?.doc(`${c.id}`).onSnapshot((doc) => {
                    co.push(doc.data())
                }))
            //console.log(co)
            return co
        }
        //console.log(posts)*/
    }, [])

    //console.log(comments)
    //console.log(posts)

    return (
        <div>



            <button id="addPost" onClick={openModal}>+</button>

            <div className="posts">
                {
                    posts.map(post => {
                        //console.log(post.comments)
                            return <Post key={post.id} id={post.id} username={post.username}
                                pictureUrl={post.pic} caption={post.caption} likes={post.likes} comments='dummy comment' likedStatus={user?.likedPosts?.includes(post.id)}/>
                    }
                    )
                }
            </div>
            {
                modalIsOpen ? <AddPost modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} /> : ''
            }
        </div>
    )
}

export default Home
