import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SignInStart: (state) => {
      state.error = null,
      state.loading = true
    },
    SignInSuccess: (state, action)=>{
        state.currentUser = action.payload,
        state.loading = false
    }, 
    SignInFailure: (state, action)=>{
        state.error = action.payload,
        state.loading = false
    },
    SignOutSuccess: (state)=>{
      state.currentUser = null,
      state.error = null,
      state.loading = false
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
       
  },
})

// Action creators are generated for each case reducer function
export const { 
  SignInStart, 
  SignInSuccess, 
  SignInFailure, 
  SignOutSuccess,
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure 
} = userSlice.actions

export default userSlice.reducer