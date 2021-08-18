import React, { useState, useEffect } from "react";
import "./Search.css";
import { db, userDb } from "../firebase";
import UserProfileHeader from "./UserProfileHeader";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../features/searchSlice";

function Search({ searchTerm }) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [profileClicked, setProfileClicked] = useState(false);
    const [foundUsers, setFoundUsers] = useState([])
    useEffect(() => {
        db.collection("users")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    setUsers((prevData) => [...prevData, {id:doc.id,data:doc.data()}]);
                });
            });
    }, []);
    useEffect(() => {
        setFoundUsers([])
        if(searchTerm === "")
        {
            setFoundUsers([])
        }
        else{
        users.map((user) => {
            if ((user.data.username).includes(searchTerm)) {
                //console.log(user.username)
                setFoundUsers(prevState => [...prevState, user])
            }
        })
    }
    }, [searchTerm])

    return (
        <div className={!profileClicked? "search_box" : "search_box_hidden"}>

            {foundUsers.map((foundUser) =>
                <div
                    className="foundItem"
                    key={foundUser.data.username}
                    onClick={() => {
                        setProfileClicked(true);
                        dispatch(setSearch(foundUser));
                    }}
                >
                {foundUser.data.username}
                </div>
            )}
            {profileClicked ? <Redirect to="/user" /> : ""}
        </div>
    );
}

export default Search;
