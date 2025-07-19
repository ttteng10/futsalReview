import { createSlice } from "@reduxjs/toolkit";

const shoeInformSlice = createSlice({
  name: "shoeInformSlice",
  initialState: { shoeInformData: {} },
  reducers: {
    selectShoeInform(state, action) {
      state.shoeInformData = action.payload;
    },
  },
});

export const characterIdAction = shoeInformSlice.actions;

export default shoeInformSlice;
