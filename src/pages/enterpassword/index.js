import Header from '@/components/header'
import styles from './password.module.css'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile, setpassword } from '@/reduser'



export default function EnterPassword() {
    const phone = useSelector(state => state.counter.phone)
    const dispatch = useDispatch()
    const router = useRouter()
    const [back, setBack] = useState('logo-main.svg')
    const [message, setMessage] = useState('')
    const passRef = useRef()

    const ReplacePassword = () => {
        dispatch(setpassword('new'))
        router.push('/enter')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { tel: phone, password: passRef.current.value }
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
        } else if (result.blocked !== '0') {
            localStorage.setItem("profile", JSON.stringify(result))
            dispatch(setprofile(result))
            router.push('/')
        } else {
            router.push('/404')
        }
    }

    return (
        <section className={styles.section} style={{ backgroundImage: `url(${back})` }}>
            <Header text='Вход' sel="/enter" />
            <h3 className={styles.registration}>Вход <br /> по номеру телефона</h3>
            <form onSubmit={handleSubmit} className={styles.inputs}>
                <input required autoComplete='on' autoFocus ref={passRef} placeholder='Пароль' type="password" inputMode="numeric" />
                <button type='submit' className={styles.button}>Войти</button>
                <p onClick={ReplacePassword}>Забыл или хочу изменить пароль</p>
            </form>
            <h4 className={styles.error}>{message}</h4>
        </section>
    )
}