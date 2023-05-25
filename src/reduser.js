import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  city: 'Минск',
  master:'',
  client: '',
  nikname:'',
  profile: {},
  order: {},
  service: 'маникюр',
  location: [53.902735, 27.561771],
  message: ''
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setmessage: (state,action) => {
      state.message = action.payload
    },
    setservice: (state,action) => {
      state.service = action.payload
    },
    setlocation: (state,action) =>{
      state.location = action.payload
    },
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
export const { setclient, setmessage, setlocation,setmaster, setcity, setnikname, setprofile,setorder,setservice } = counterSlice.actions

export default counterSlice.reducer