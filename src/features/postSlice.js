//import { useState } from 'react'
import { createSlice } from '@reduxjs/toolkit';
import { db,postDb } from '../firebase'
/*
const getPosts = () => {
    var postsList = []
postDb.orderBy("timeStamp", "desc").onSnapshot(snapshot => {
            postsList.push(snapshot.docs.map(doc =>
            ({
                id: doc.id,
                data: doc.data(),
                //comments: commentsSetUp(doc, doc.id)
            })
            ))
        return postsList
        })
}*/
export const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
  },
//actions
  reducers: {
    setPosts:(state, action) => {
      state.posts = action.payload;
    },
}});

export const { setPosts } = postSlice.actions;
// selectors
export const selectPosts = (state) => state.posts.posts;

export default postSlice.reducer;
