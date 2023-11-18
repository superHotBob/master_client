import { useState ,useLayoutEffect} from 'react'
import Menu_icon from '../icons/menu'
import styles from './message.module.css'


export default function Message ({ text, page, color = ['linear-gradient(to left, #3D4EEA, #5E2AF0)', '#3D4EEA', '#ECEEFD'] }) {
    const [view, close] = useState(false)
    function closeMessage() {
        close(false)
        let mess =  JSON.parse(localStorage.getItem('message')) || {}
        
        mess[page] = false
        let parse_mess = JSON.stringify(mess)
        localStorage.setItem('message',parse_mess)
    }
    useLayoutEffect(()=>{     
      let mm =  JSON.parse(localStorage.getItem('message'))
      if(mm) {       
        close(mm[page] === false ? mm[page] : true)
      } else {
        close(true)
        return
      }
      
    },[])
   
    return <>
        {view ? 
        <div className={styles.message} style={{color: color[1],background:color[2]}} onClick={closeMessage}>
            <h1>{text}</h1>
            <Menu_icon color={color[1]}  type='close__message' />
        </div> : null}
    </>
}