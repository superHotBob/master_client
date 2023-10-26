import Header from '@/components/header'
import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setphone } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function Enter() {

    const [phone, setPhone] = useState()
    const dispatch = useDispatch()
    const password = useSelector(state => state.counter.password)
    const my_phone = useSelector(state => state.counter.phone)

    const router = useRouter()
    const [number, setNumber] = useState([, , ,])
    const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')
    const [message, setMessage] = useState('')
    const [t, setT] = useState()



    useEffect(() => {
        setPhone(my_phone)       
        if (password === 'new') {
            setSelect('Восстановление пароля')
            firstCall()         
        }        
    }, [password, my_phone])

   

    const firstCall = () => {
        fetch(`/api/check_client?phone=${phone}`)
            .then(res => res.json())
            .then(res => {
                if(password === 'new') {
                    Call()                   
                }
                if (res.length === 0) {
                    Call();                    
                } else if (res[0].blocked != '0') {
                    router.push('/enter')
                } else {
                    dispatch(setphone(phone))
                    router.push('/enterpassword')
                }
        })
    }

    async function Call() {
        const data = { tel: phone || my_phone}
        console.log('data',data)
        const res = await fetch(`/api/get_code`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const txt = await res.text()
        

        if (res.status === 400) {
            setSelect('Подтвердить'),
            setTimeout(() => document.getElementById(0).focus(), 500),
            dispatch(setphone(phone))
        } else {
            setT(+txt)
            console.log(txt)
        }

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


    async function sendCode() {
        const data = { tel: phone, number: +number.join('') }
        fetch('/api/get_code', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {
                if (res.status === 200) {
                    dispatch(setphone(phone))
                    router.push('newpassword')
                } else if (res.status === 404) {
                    setSelect('Подтвердить')
                    // setMessage('Не верный код')
                } else if (res.status === 500) {
                    setMessage('Вы исчерпали лимит попыток')
                    setT(60)
                } else {
                    setMessage('Не верный код')
                }
            })
    }


    const handleKeyDown = (e, b) => {
        if (e.key === 'Backspace') {
            if (!e.target.value >= 0 && b >= 0) {
                document.getElementById(b - 1).focus()
            }
        }
        if (e.key === 'Enter' && b === 3) {
            sendCode()
        }
    };

    function Number(a, b) {
        let nmb = number
        nmb[b] = a
        setNumber(nmb)
        if (a > 0 && b < 3) {
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
        <section className={styles.section} style={{ backgroundImage: `url(${back})` }}>
            <Header text={select} sel="back" />
            {select === 'Вход' ?
                <div className={styles.inputs}>
                    <h3 className={styles.registration}>
                        Вход по номеру телефона
                    </h3>
                    <p>Используйте свой номер телефона как логин для входа на сайт.</p>
                    <PhoneInput
                        country={'by'}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true
                        }}
                        countryCodeEditable={false}
                        onlyCountries={['by', 'ru']}
                        value={phone}
                        prefix='+'
                        containerStyle={{
                            border: '1px solid #3D4EEA',
                            borderRadius: '6px',
                            height: '46px',
                            display: 'flex'
                        }}
                        searchStyle={{
                            border: 'none', borderRight: '1px solid #3D4EEA'
                        }}
                        buttonStyle={{ border: 'none', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}
                        placeholder='номер телефона'

                        onChange={phone => setPhone(phone)}

                        inputStyle={{ fontFamily: '__Rubik_7303a2', border: 'none', borderRight: 'none', height: 'auto' }}
                    />
                    {message ?
                        <h3 className={styles.error} >
                            Повторно запросить звонок
                            можно будет через  <b>{t}</b> сек.
                        </h3> :
                        <>
                            <button disabled={phone?.length < 11} className={styles.button} onClick={firstCall}>
                                Войти
                            </button>
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
                        {[0, 1, 2, 3].map(i =>
                            <input
                                id={i}
                                key={i}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                pattern="[0-9]*"
                                type="text"
                                inputMode='numeric'
                                required maxLength={1} onChange={(e) => Number(e.target.value, i)}
                            />)}
                    </div>
                    {message ?
                        <>
                            <h3 className={styles.error} >Не верный код</h3>
                            <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                        </>
                        :
                        <>
                            <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                            <h6>Не получили звонок?</h6>

                        </>
                    }
                    <h4 onClick={Reload}>Повторить попытку</h4>
                </div>}
        </section>

    )
}