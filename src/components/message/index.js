import { useState } from 'react'
import Menu_icon from '../icons/menu'
import styles from './message.module.css'

export default function Message ({ text, color = ['','#3D4EEA','#ECEEFD'] }) {
    const [view, close] = useState(true)
    return <>
        {view ? <div className={styles.message} style={{color: color[1],background:color[2]}} onClick={() => close(false)}>
            {text}
            <Menu_icon color={color[1]}  type='close__message' />
        </div> : null}
    </>
}