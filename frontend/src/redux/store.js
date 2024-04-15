import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
/***
 * 1. configure persist where your state will be stored
 * 2. combine all the reducers in one reducers named: ROOT REDUCERS for state management in certain boundary
 * 3. created persisted reducers, which reducers you don't want to loose it's state in our case its combined reducers, named as root reducers
 * 4. create storage for them where their state will be stored safely!
 * 5. export them
 */
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const rootReducer = combineReducers({
    user: userReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck: false}),
})

export const persistor = persistStore(store);