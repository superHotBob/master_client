import Header from '@/components/header'
import styles from './password.module.css'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setpassword, setprofile } from '@/reduser'





const url = 'https://masters-client.onrender.com'


export default function Password() {
    const phone = useSelector(state => state.counter.phone)
    const password = useSelector(state => state.counter.password)
    const dispatch = useDispatch()

    const router = useRouter()
    const [back, setBack] = useState('logo.svg')

    const [message, setMessage] = useState('')

    const passRef = useRef()
    const twopassRef = useRef()








    const handleSubmit = async (e) => {
        e.preventDefault()
        if (passRef.current.value.length < 8) {
            setTimeout(() => setMessage(''), 2000)
            return setMessage('Пароль короткий')
        }
        if (passRef.current.value !== twopassRef.current.value) {
            setTimeout(() => setMessage(''), 2000)
            return setMessage('Пароли не совпадают')
        }
        const data = { tel: phone, password: passRef.current.value }
        setBack("await.gif")
        if (password === 'new') {
            fetch('/api/replace_password', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
                .then(res => {
                    setMessage('Пароль изменен')
                    dispatch(setpassword(''))
                    setTimeout(() => {
                        router.push('/enter')
                       
                    }, 2000); 
                    
                })
        } else {           
            const response = await fetch('/api/enter_phone', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
            const result = await response.json()
            if (result.message) {
                router.reload()
            } else if (result.blocked !== 'yes') {
                localStorage.setItem("profile", JSON.stringify(result))
                dispatch(setprofile(result))
                router.push('/succesregistration')
            } else {
                router.push('/404')
            }
        }
    }


    return (
        <section className={styles.section} >
            <Header text={password === 'new' ? 'Восстановление пароля' : 'Регистрация'} sel="/enter" />
            <div className={styles.image} style={{ backgroundImage: `url(${back})` }} />
            <h3 className={styles.registration}>
                {password === 'new' ? 'Восстановление пароля' : 'Регистрация  по номеру телефона'}
            </h3>
            <div className={password ==='new' ? styles.inputs_password : styles.inputs}>
                <form onSubmit={handleSubmit}>
                    <input required ref={passRef} placeholder='Пароль (8 символов)' type="password" minLength={8} maxLength={8} />
                    <input required ref={twopassRef} placeholder='Подтвердить пароль' type="password" minLength={8} maxLength={8} />
                    <button className={styles.button} type="submit">
                        {password === 'new' ? 'Восстановить пароль' : 'Завершить регистрацию'}
                    </button>
                </form>
                <div className={styles.colaboration}>
                                Нажмая на кнопку, вы соглашаетесь с<br />
                                <span style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                                    данных</span>  и <span style={{ color: "#3D4EEA" }}>Пользовательским соглашением</span>
                            </div>

                <h4 className={styles.error}>{message}</h4>
            </div>
        </section>

    )
}