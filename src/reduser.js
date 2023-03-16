import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  city: 'Минск',
  master:'',
  client: '',
  nikname:'',
  profile: {},
  order: {}
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setprofile: (state,action) => {
      state.profile = Object.assign({},action.payload)
    },
    setclient: (state, action) => {
      state.client = action.payload
    },
    setmaster: (state, action) => {
      state.master = action.payload
    },
    setcity: (state, action) => {
      state.city = action.payload
    },
    setnikname: (state, action) => {
      state.nikname = action.payload
    },
    setorder: (state,action) => {
      state.order = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setclient, setmaster, setcity, setnikname, setprofile,setorder } = counterSlice.actions

export default counterSlice.reducer