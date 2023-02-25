import { createSlice } from '@reduxjs/toolkit';
import { db,postDb } from '../firebase'

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
