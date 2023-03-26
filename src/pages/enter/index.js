import Header from '@/components/header'
import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setmaster, setclient, setnikname,setprofile } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function Enter() {
    const [phone, setPhone] = useState()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleSubmit = async (event) => {        
        event.preventDefault()             
        const data = {tel: phone}
       
        const response = await fetch('/api/enter_phone', {
            
            body: JSON.stringify(data),
           
            headers: {
                'Content-Type': 'application/json',
            },
            // The method is POST because we are sending data.
            method: 'POST',
        })

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        localStorage.setItem("profile", JSON.stringify(result));
        dispatch(setprofile(result))                      
        router.push('/')    
          
           
            
            
       
            
        
    }
    return (
        <div className={styles.main}>
            <Header text="Вход" sel="/" />
            <section className={styles.section}>
                <div className={styles.inputs}>
                    <p>Используйте свой номер телефона как логин для входа на сайт.</p>
                    {/* <span>номер телефона</span> */}
                   
                        {/* <input type="tel" name="tel" pattern="[\+()]*(?:\d[\s\-\.()xX]*){10,14}"
                            required
                            minlength="11"
                            maxlength="13"
                        /> */}
                        <PhoneInput
                            country={'by'}
                            onlyCountries={['by','ru']}
                           
                           
                            value={phone}
                           
                            prefix='+'
                           
                            placeholder='номер телефона'
                            onChange={phone => setPhone(phone)}
                        />
                        <div className={styles.button} onClick={handleSubmit}>
                            Войти
                            
                        </div>
                   
                    <div className={styles.colaboration}>
                        Нажмая на кнопку, вы соглашаетесь с<br />
                        <span style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                            данных</span>  и <span style={{ color: "#3D4EEA" }}>Пользовательским соглашением</span>
                    </div>
                </div>
            </section>


        </div>
    )
}