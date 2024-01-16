import Header from '@/components/header'
import styles from '../enter/enter.module.css'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile, setpassword, setphone, setcity } from '@/reduser'



export default function EnterPassword() {
    const  phone  = useSelector(state=>state.counter.my_phone)
    const dispatch = useDispatch()
    const router = useRouter()
    const [back, setBack] = useState('logo-main.svg')
    const [message, setMessage] = useState('')
    const passRef = useRef()
    console.log(phone)
    const ReplacePassword = () => {
        dispatch(setpassword('new'))
        // dispatch(setphone(router.query.phone))       
        router.push('/enter')
    }

    if (!phone ) {
       
        setTimeout(()=>router.push('/enter'),500) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();       
        const data = { tel: +phone, password: passRef.current.value }      
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
            if( result.city) {
                dispatch(setcity(result.city ))      
            }
            saveToHistory(result)   
            router.push('/')
        }
    }

    async function saveToHistory() {
        let responce = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=ecc713e733a64a24bd32521c2f47be98&fields=city,ip_address')
        let data = await responce.json()    
        fetch(`/api/save_history?phone=${phone}&city=${data.city}&ip_address=${data.ip_address}`)
        .then(res=>res.text())
        .then(res=>console.log(res))
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