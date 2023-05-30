import Header from '@/components/header'
import styles from './password.module.css'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setprofile } from '@/reduser'





const url = 'https://masters-client.onrender.com'


export default function Password() {
    const phone = useSelector(state=>state.counter.phone)
    const password = useSelector(state=>state.counter.password)
    const dispatch = useDispatch()
    const router = useRouter()    
    const [back, setBack] = useState('logo.svg')
    
    const [message, setMessage] = useState('')

    const passRef = useRef()
    const twopassRef = useRef()


    
    


   

    const handleSubmit = async () => {
        if(passRef.current.value.length<8) {
            setTimeout(()=>setMessage(''),2000)
            return  setMessage('Пароль короткий')           
        }
        if(passRef.current.value !== twopassRef.current.value) {
            setTimeout(()=>setMessage(''),2000)
           return setMessage('Пароли не совпадают')
        }
        const data = { phone: phone, password: passRef.current.value }
        setBack("await.gif")
        if(password) {
                fetch('/api/replace_password', {
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                })
                .then(res=>{
                    setMessage('Пароль изменен')
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
                router.push('/')
            } else {
                router.push('/404')
            }
        }    
    }
    
   
    return (
        <section className={styles.section} >
            <Header text={password ? 'Восстановление пароля':'Регистрация' } sel="/enter"  />
            <div className={styles.image} style={{ backgroundImage: `url(${back})` }} />
            <h3 className={styles.registration}>
                {password ? 'Восстановление пароля': 'Регистрация <br/> по номеру телефона'}
            </h3>
            <div className={password ? styles.inputs_password : styles.inputs}>
                <form>
                    <input ref={passRef} placeholder='Пароль' type="password" minLength={8} maxLength={8} />
                    <input ref={twopassRef} placeholder='Подтвердить пароль' type="password" minLength={8} maxLength={8} />
                </form>

                <div className={styles.button} onClick={handleSubmit}>
                {password ? 'Восстановить пароль' : 'Завершить регистрацию'}
                </div>
                <h4 className={styles.error}>{message}</h4>
            </div>
        </section>

    )
}