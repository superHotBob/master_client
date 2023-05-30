import Header from '@/components/header'
import styles from './password.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'

const url = 'https://masters-client.onrender.com'


export default function EnterPassword() {
    const phone = useSelector(state => state.counter.phone)
    const dispatch = useDispatch()
    const router = useRouter()   
    const [back, setBack] = useState('logo-main.svg')  
    const [message, setMessage] = useState('')
    const passRef = useRef()    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { tel: phone, password: passRef.current.value  }
        setBack("await.gif")
        setMessage('')
        
        const response = await fetch('/api/enter_phone', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const result = await response.json()      
        if (result.length === 0) {
           setMessage('Пароль не верный')
           setBack('logo-main.svg')
        } else if (result.blocked !== 'yes') {
            localStorage.setItem("profile", JSON.stringify(result))
            dispatch(setprofile(result))
            router.push('/')
        } else {
            router.push('/404')
        }
    }
   
   
    
    return (
        <section className={styles.section} >
            <Header text='Вход' sel="/enter"  />
            <div className={styles.image} style={{ backgroundImage: `url(${back})` }} />
            <h3 className={styles.registration}>Вход <br/> по номеру телефона</h3>
            <div className={styles.inputs}>
                <form onSubmit={handleSubmit}>
                    <input autoFocus ref={passRef} placeholder='Пароль' type="password"  />                   
                    <button type='submit' className={styles.button}>Войти</button> 
                    <Link href="/enter">Изменить пароль</Link>                   
                </form>                
                <h4 className={styles.error}>{message}</h4>
            </div>
        </section>

    )
}