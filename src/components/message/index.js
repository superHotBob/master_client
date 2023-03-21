import { useState } from 'react'
import styles from './message.module.css'

export default function ({ text }) {
    const [view, close] = useState(true)
    return <>
        {view ? <div className={styles.message} onClick={() => close(false)}>
            {text}
        </div> : null}
    </>
}