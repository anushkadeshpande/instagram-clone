import React, { useState, useEffect } from 'react'
import './Search.css'
import { db, userDb } from '../firebase'
import UserProfileHeader from './UserProfileHeader'
import { Redirect } from 'react-router'
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from '../features/searchSlice';

import PublicView from '../Screens/PublicView'


function Search({ searchTerm }) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([])
    const [profileClicked, setProfileClicked] = useState(false)
    useEffect(() => {
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                setUsers(prevData => [...prevData, doc.data()])
            });
        });

    }
        , [])
    console.log(users)
    return (
        <div className="search_box">
            {
                users.map(user => <div key={user.username} onClick={() => {setProfileClicked(true);dispatch(setSearch(user))}}>{user.username}</div>)
            }
            {
                profileClicked ?
                    <Redirect to='/searchResult' /> : ""

            }
        </div>
    )
}

export default Search
