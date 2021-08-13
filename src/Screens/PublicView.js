import React from 'react'
import UserProfileHeader from '../Components/UserProfileHeader'
import { useDispatch, useSelector } from "react-redux";
import { selectSearched } from '../features/searchSlice';
function PublicView() {
    const search = useSelector(selectSearched)
    return (
        <div>
        {console.log(search)}
        <UserProfileHeader user={search} username={search.username} postsCount={search.posts?.length} mode="searchedAccount"/>  
        </div>
    )
}

export default PublicView
