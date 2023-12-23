import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reduser.js'
import { getImage } from './data..js'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
      },
      // middleware: () => [getImage],
})