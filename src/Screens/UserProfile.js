import React, { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useHistory } from 'react-router-dom'
import './UserProfile.css'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice';
import { db, postDb, userDb } from '../firebase'
import UserProfileHeader from '../Components/UserProfileHeader'
function UserProfile() {
    const user = useSelector(selectUser);
    const history = useHistory()
    //console.log(user)
    const [posts, setPosts] = useState([])

    useEffect(() => {

        const fetchPosts = () => {
            setPosts([])
            user?.posts?.map(post => {
                postDb.doc(post).get().then(doc => setPosts(prevState => [doc.data(), ...prevState])
                )
            })
        }
        fetchPosts()
    }, [])

    return (
        <div className="userProfile">
           <UserProfileHeader user={user} username={user.userName} postsCount={posts.length} mode="myProfile"/>

            <div className="userPosts">
                {posts.map(post => <div className="grid-pic" style={{ backgroundImage: `url(${post?.pic})` }}>
                </div>)}
            </div>
        </div>
    )
}

export default UserProfile
