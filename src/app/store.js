import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import postReducer from '../features/postSlice'
import searchReducer from '../features/searchSlice'
export default configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    searchedAcc: searchReducer
  },
  devTools: true,
});
