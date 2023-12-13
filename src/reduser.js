import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  city: 'Минск',
  password: null,
  client: '',
  date_order:'',
  master: '',
  nikname:'',
  my_phone: '',
  profile: {},
  order: [],
  service: 'маникюр',
  location: [53.902735, 27.561771],
  message: '',
  tema: 0,
  mystate: 'Минская область'
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    settema : (state,action) => {
      state.tema = action.payload
    },
    setstate : (state, action) => {
      state.mystate = action.payload
    },
    setmessage: (state,action) => {
      state.message = action.payload
    },
    setdate: (state,action) => {
      state.date_order = action.payload
    },
    setmaster: (state,action) => {
      state.master = action.payload     
    },
    setphone: (state,action) => {
      state.my_phone = action.payload
    },
    setservice: (state,action) => {
      state.service = action.payload
    },
    setlocation: (state,action) =>{
      console.log(action.payload)
      state.location = action.payload
    },
    setprofile: (state,action) => {
      state.profile = Object.assign({},action.payload)
    },
    setclient: (state, action) => {
      state.client = action.payload
    },
    setpassword: (state, action) => {
      state.password = action.payload
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
export const {setstate, settema, setdate, setmaster,setphone,setclient, setmessage, setlocation,setpassword, setcity, setnikname, setprofile,setorder,setservice } = counterSlice.actions

export default counterSlice.reducer