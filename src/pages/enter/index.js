import Header from '@/components/header'
import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// const url = 'http://localhost:5000'


const url = 'https://masters-client.onrender.com'


export default function Enter() {
    const refPhone = useRef()
    const [phone, setPhone] = useState()
    const dispatch = useDispatch()
    const router = useRouter()
    const [number, setNumber] = useState([, , ,])
    const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')
    const [message, setMessage] = useState('')
    const [t, setT] = useState()

    useEffect(() => {
        setNumber([, , ,])
        setSelect('Вход')
        setBack('logo-main.svg')
        setMessage('')
    }, [])

    function firstCall(event) {
        event.preventDefault()
        const data = { tel: phone }
        setBack("await.gif")
        fetch(`${url}/call`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {
                if (res.status === 200) {
                    setSelect('Подтвердить'),
                        setBack("logo-main.svg"),
                        setTimeout(() => document.getElementById(0).focus(), 500)
                } else {
                    setT(60)
                    setBack("logo-main.svg")
                }
            })

    }
    useEffect(() => {
        if (t > 0) {
            let timer = setInterval(() => {
                setT(t - 1)
                setMessage(t)
            }, 1000);

            return () => clearInterval(timer)
        } else {
            setMessage()
        }

    }, [t])


    async function SendCode(event) {
        event.preventDefault()
        const data = { tel: phone, number: +number.join('') }
        fetch(`${url}/code`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {                
                if (res.status === 200) {
                    handleSubmit()
                } else {
                    setMessage('dfg')
                }
            })
    }

    const handleSubmit = async () => {
        const data = { tel: phone }
        setBack("await.gif")
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
    function Number(a, b) {
        let nmb = number
        console.log(typeof a )
       
            nmb[b] = a
            setNumber(nmb)
            if (b < 3) {
                document.getElementById(b + 1).focus()
            }
       
       
    }
    function Reload() {
        setNumber([, , ,])
        setSelect('Вход')
        setBack('logo-main.svg')
        setMessage('')
    }
    return (
        <section className={styles.section} >
            <Header text={select} sel="/" />
            <div className={styles.image} style={{ backgroundImage: `url(${back})` }} />
            {select === 'Вход' ?
                <div className={styles.inputs}>
                    <p>Используйте свой номер телефона как логин для входа на сайт.</p>
                    <PhoneInput
                        country={'by'}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true
                        }}
                        onlyCountries={['by', 'ru']}
                        value={phone}
                        prefix='+'
                        placeholder='номер телефона'
                        onChange={phone => setPhone(phone)}
                    />
                    {message ?
                        <h3 className={styles.error} >
                            Повторно запросить звонок
                            можно будет через  <b>{t}</b> сек.
                        </h3> : 
                        <>
                            <div className={styles.button} onClick={firstCall}>Войти</div>
                            <div className={styles.colaboration}>
                                Нажмая на кнопку, вы соглашаетесь с<br />
                                <span style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                                    данных</span>  и <span style={{ color: "#3D4EEA" }}>Пользовательским соглашением</span>
                            </div>
                        </>}
                </div>
                :
                <div className={styles.number}>
                    <p>
                        Введите последние 4 цифры водящего номера.<br />
                        Отвеать на звонок не нужно. Звоним на <br />
                        указанный номер:
                    </p>
                    <h4>+{phone}</h4>
                    <h5>Например +7 XXX XXX  <span>12 34</span></h5>
                    <div className={styles.numbers} >
                        {[0, 1, 2, 3].map(i => <input id={i} key={i} pattern="[0-9]*" type="text" inputMode='numeric' required  maxLength={1}  onChange={(e) => Number(e.target.value, i)} />)}
                    </div>
                    {message ? <h3 className={styles.error} >Не верный код</h3>
                        :
                        <>
                            <div className={styles.button} onClick={SendCode}>Подтвердить</div>
                            <h6>Не получили звонок?</h6>
                        </>
                    }
                    <h4 onClick={Reload}>Повторить попытку</h4>
                </div>}
        </section>

    )
}