import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { emptyAuthorList } from "./authorListType";
import {authorActions} from "../authorSlice";
import {Author} from "../AuthorType";

const AuthorListSlice = createSlice({
    name: 'authorList',
    initialState: emptyAuthorList,
    reducers: {
      getAllAuthors:  (state) => { return state; },
      setAllAuthors:  (state, action) => { return action.payload; },
    },
    extraReducers: (builder) => {
       builder
         .addCase(authorActions.createAuthor,
                 (state, action: PayloadAction<Author>) => {
                   state.items.push(action.payload);
                   return state;
                 })
         .addCase(authorActions.updateAuthor,
                  (state, action: PayloadAction<Author>) => {
                     const index = state.items.findIndex((author) =>
                        author && author.id === action.payload.id);
                     if ( index > -1 ) { state.items[index] = action.payload; }
                     return state;
                  });
    }
});

export const {
  actions: authorListActions,
  reducer: authorListReducer,
} = AuthorListSlice;

export default AuthorListSlice;