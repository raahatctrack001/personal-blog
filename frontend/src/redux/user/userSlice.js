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
    signInStart: (state) => {
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
    }    
  },
})

// Action creators are generated for each case reducer function
export const { signInStart, SignInSuccess, SignInFailure } = userSlice.actions

export default userSlice.reducer