import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BoxList, emptyBoxList} from "./BoxListType";
import {boxActions} from "../boxSlice";
import {Xbiis} from "../boxTypes";
import {User} from "../../User/userType";

const BoxListSlice = createSlice({
    name: 'boxList',
    initialState: emptyBoxList,
    reducers: {
      getAllBoxes:         (state) => { return state; },
      getAllWritableBoxes: (state, action: PayloadAction<User>) => { return state; },
      setAllBoxes:         (state, action: PayloadAction<BoxList>) => { return action.payload; },
      addBox:              (state, action: PayloadAction<Xbiis>) => { state.items.push(action.payload); },
    },
    extraReducers: (builder) =>
    {
       builder
         /*
         .addCase(boxActions.createBox,
                  (state, action) => {
                     state.items.push(action.payload);
                     return state;
                  })
         */
         .addCase(boxActions.updateBox,
                  (state, action: PayloadAction<Xbiis>) => {
                     const index = state.items.findIndex(box => box?.id ===action.payload.id);
                     if ( -1 < index ) { state.items[index] = action.payload }
                     return state;
                  })
          .addCase(boxActions.removeBox, (state, action) =>
                   {
                      state.items = state.items.filter(box => box?.id !== action.payload.id);
                      return state;
                   })
    }
    /*
    {
      createBox: (state, action) => {
         state.items.push(action.payload);
         return state
      },
    }
    */
});

export const {
  actions: boxListActions,
  reducer: boxListReducer,
} = BoxListSlice;

export default BoxListSlice;