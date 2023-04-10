import Header from '@/components/header'
import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function Enter() {
    const [phone, setPhone] = useState()
    const dispatch = useDispatch()
    const router = useRouter()
    const [number, setNumber] = useState([,,,])
    const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')

    useEffect(()=>{
        setNumber([,,,])
        setSelect('Вход')
        setBack('logo-main.svg')
    },[])

    const firstHandleSubmit = async (event) => {
        event.preventDefault()
        setSelect('Подтверждение')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = { tel: phone , number: +number.join('')}

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
        } else if (result.blocked !== 'yes'){
            localStorage.setItem("profile", JSON.stringify(result))
            dispatch(setprofile(result))
            router.push('/')
        } else {
            router.push('/404')
        }
    }
    function Number(a,b) {
        console.log(a,b)
        let nmb = number
        nmb[b] = a
        setNumber(nmb)
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
                    onlyCountries={['by', 'ru']}

                    value={phone}

                    prefix='+'

                    placeholder='номер телефона'
                    onChange={phone => setPhone(phone)}
                />
                <div className={styles.button} onClick={firstHandleSubmit}>
                    Войти
                </div>
                <div className={styles.colaboration}>
                    Нажмая на кнопку, вы соглашаетесь с<br />
                    <span style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                        данных</span>  и <span style={{ color: "#3D4EEA" }}>Пользовательским соглашением</span>
                </div>
            </div>
            : 
            <div className={styles.number}>
                <p>
                    Введите последние 4 цифры водящего номера.<br/>
                    Отвеать на звонок не нужно. Звоним на <br/>
                    указанный номер:
                </p>
                <h4>+{phone}</h4>
                <h5>Например +7 XXX XXX  <span>12 34</span></h5>
                <div className={styles.numbers}>
                    <input type="text" maxLength={1} value={number[0]} onChange={(e)=>Number(e.target.value,0)}/>
                    <input type="text" maxLength={1} value={number[1]} onChange={(e)=>Number(e.target.value,1)}/>
                    <input type="text" maxLength={1} value={number[2]} onChange={(e)=>Number(e.target.value,2)}/>                   
                    <input type="text" maxLength={1} value={number[3]} onChange={(e)=>Number(e.target.value,3)}/>                   
                </div>
                <div className={styles.button} onClick={handleSubmit}>
                    Подтвердить
                </div>
                <h6>Не получили звонок?</h6>
                <h4 onClick={()=>setSelect('Вход')}>Повторить попытку</h4>
                
            </div>}
        </section>

    )
}