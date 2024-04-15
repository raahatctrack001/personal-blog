import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import themeReducers from './theme/themeReducers'

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducers
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)
 


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDeafultMiddleware) => getDeafultMiddleware({serializableCheck: false})

})

export const persistor = persistStore(store)