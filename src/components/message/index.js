import { useState } from 'react'
import Menu_icon from '../icons/menu'
import styles from './message.module.css'
import { useEffect } from 'react'

export default function Message ({ text, page, color = ['','#3D4EEA','#ECEEFD'] }) {
    const [view, close] = useState(true)
    function Close() {
        close(false)
        let mess =  JSON.parse(localStorage.getItem('message')) || {}
        
        mess[page] = false
        let parse_mess = JSON.stringify(mess)
        localStorage.setItem('message',parse_mess)
    }
    useEffect(()=>{
     
      let mm =  JSON.parse(localStorage.getItem('message'))
      if(mm) {
        console.log(mm[page])
        close(mm[page] === false ? mm[page] : true)
      } else {
        return
      }
      
    },[])
    return <>
        {view ? <div className={styles.message} style={{color: color[1],background:color[2]}} onClick={Close}>
            {text}
            <Menu_icon color={color[1]}  type='close__message' />
        </div> : null}
    </>
}