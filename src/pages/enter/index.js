import Header from '@/components/header'
import styles from './enter.module.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setphone } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Link from 'next/link'
import EnterCode from '@/components/entercode'


export default function Enter() {

    const dispatch = useDispatch()    
    const { my_phone } = useSelector(state => state.counter)
    const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')
    const [message, setMessage] = useState('')
    const [t, setT] = useState(null)
    const [validnumber, setvalidnumber] = useState(true)

    async function Call() {
        const res_ip = await fetch('https://api.ipgeolocation.io/getip')
        const ip = await res_ip.json()
        const data = { tel: +my_phone, ip: ip.ip }
        const res = await fetch(`/api/get_code_first`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const txt = await res.json()          
        if (txt.statusCode === 200) {
            setSelect('Подтвердить')
            // setTimeout(() => document.getElementById(1).focus(), 500)
            // setT(30)
            // setTimeout(()=>{
            //     setrepeat(false)               
            // }, 30000)           
        } else if (txt.statusCode === 429) {           
            console.log(txt.message)
            setMessage(txt.message)
        } else { }
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
                        value={my_phone}
                        isValid={(value, country) => {
                            if (value.length < 12 && country.dialCode === '375') {
                                return setvalidnumber(true)
                            } else if (value.length < 11 && country.dialCode === '7') {
                                return setvalidnumber(true)
                            } else {
                                return setvalidnumber(false)
                            }
                        }}
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

                        onChange={e => e.length < 11 ? null : dispatch(setphone(e))}

                        inputStyle={{ fontFamily: '__Rubik_7303a2', border: 'none', borderRight: 'none', height: 'auto' }}
                    />

                    {message ? <h5 className={styles.error}>{ message }</h5> : null }
                    <button disabled={validnumber} className={styles.button} onClick={Call}>
                        Войти
                    </button>
                    <div className={styles.colaboration}>
                        Нажмая на кнопку, вы соглашаетесь с<br />
                        <a>Условиями обработки персональных <br />
                            данных</a>  и <Link href="/informations/agreement">Пользовательским соглашением</Link>
                    </div>


                </div>
                :
                <EnterCode back={setSelect} />
            }
        </section>
    )
}