import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state)=>{
        state.error = null,
        state.loading = true
    },
    signInSuccess: (state, action)=>{
        state.currentUser = action.payload;
        state.error = null,
        state.loading = false
    },
    SignInFailure: (state, action)=>{
        state.loading = false,
        state.error = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, SignInFailure } = userSlice.actions

export default userSlice.reducer