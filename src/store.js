import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reduser.js'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
      },
})