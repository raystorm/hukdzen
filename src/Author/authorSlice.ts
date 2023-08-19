import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Author, emptyAuthor} from "./AuthorType";


const authorSlice = createSlice({
    name: 'author',
    initialState: emptyAuthor,
    reducers: {
      getAuthorById: (state, action: PayloadAction<string>) => { return state; },
      setAuthor:     (state, action: PayloadAction<Author>) => { return action.payload; },
      updateAuthor:  (state, action: PayloadAction<Author>) => { return action.payload; },
      createAuthor:  (state, action: PayloadAction<Author>) => { return action.payload; },
      clearAuthor:   (state) => { return emptyAuthor; },
    }
});

export const {
   actions: authorActions,
   reducer: authorReducer,
} = authorSlice;

export default authorSlice;