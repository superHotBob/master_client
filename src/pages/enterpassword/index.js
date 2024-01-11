import Header from '@/components/header'
import styles from '../enter/enter.module.css'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile, setpassword, setphone, setcity } from '@/reduser'



export default function EnterPassword() {
    
    const dispatch = useDispatch()
    const router = useRouter()
    const [back, setBack] = useState('logo-main.svg')
    const [message, setMessage] = useState('')
    const passRef = useRef()

    const ReplacePassword = () => {
        dispatch(setpassword('new'))
        dispatch(setphone(router.query.phone))       
        router.push('/enter')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();       
        const data = { tel: +router.query.phone, password: passRef.current.value }      
        setMessage('')      

        const response = await fetch('/api/enter_password', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'                
            },
            method: 'POST',
        })
        const result = await response.json()
        if (result.length === 0) {
            setMessage('Пароль не верный')
            setBack('logo-main.svg')
        } else {
            localStorage.setItem("profile", JSON.stringify(result))
            dispatch(setprofile(result)) 
            dispatch(setcity(result.city ))          
            router.push('/')
        }
    }

    return (
        <section className={styles.section} style={{ backgroundImage: `url(${back})` }}>
            <Header text='Вход' sel="/enter" />            
            <form onSubmit={handleSubmit} className={styles.inputs_password}>
                <h3 className={styles.registration}>Вход по номеру телефона</h3>
                <p>Введите пароль вашего  аккаунта.</p>
                <input required autoComplete='on' autoFocus ref={passRef} placeholder='Пароль' type="password" inputMode="numeric" />
                <button type='submit' className={styles.button}>Войти</button>
                <p onClick={ReplacePassword}>Востановить или изменить пароль</p>
            </form>
            <h4 className={styles.error}>{message}</h4>
        </section>
    )
}