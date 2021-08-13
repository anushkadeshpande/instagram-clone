import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase'
import { useHistory } from 'react-router-dom'
function UserProfileHeader({user ,username ,postsCount , mode}) {
    
    const history = useHistory()
    return (
        <div>
             <div className="userProfile__header">
                <div className="userProfile__header__image">
                    <img src="http://www.defineinternational.com/wp-content/uploads/2014/06/dummy-profile.png" alt="" />
                </div>
                <div className="userProfile__header__details">
                    <div className="user__data__header">
                        <p>{username}</p>
                        {
                            mode === "myProfile"?
                                <button onClick={() => { auth.signOut(); history.push('/') }}>Log Out</button>
                            :mode === "searchedAccount"?
                                <button>Follow</button>
                                :""
                        }
                    </div>
                    
                    <div className="user__data">
                        <p><strong>{postsCount} </strong> <small>Posts</small></p>
                        <p><strong>0 </strong><small>Followers</small></p>
                        <p><strong>0 </strong><small>Following</small></p>
                    </div>

                    <h3>{user?.name}</h3>
                </div>
            </div>

        </div>
    )
}

export default UserProfileHeader
