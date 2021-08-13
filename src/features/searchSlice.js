import { createSlice } from '@reduxjs/toolkit';


export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    search: null,
  },
//actions
  reducers: {
    setSearch:(state, action) => {
      state.search = action.payload;
    },
    removeSearch:(state) => {
      state.search = null;
    }
  },
});

export const { setSearch, removeSearch } = searchSlice.actions;
// selectors
export const selectSearched = (state) => state.searchedAcc.search;

export default searchSlice.reducer;
