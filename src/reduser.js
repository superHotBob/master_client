import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  city: 'Минск',
  master:'',
  client: ''
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setclient: (state, action) => {
      state.client = action.payload
    },
    setmaster: (state, action) => {
      state.master = action.payload
    },
    setcity: (state, action) => {
      state.city = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setclient, setmaster, setcity } = counterSlice.actions

export default counterSlice.reducer