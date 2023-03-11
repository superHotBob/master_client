import Header from '@/components/header'
import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setmaster, setclient } from '@/reduser'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function Enter() {
    const [phone, setPhone] = useState()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        // Cast the event target to an html form
        const form = event.target

        // Get data from the form.
        const data = {
            tel: phone
        }

        // Send the form data to our API and get a response.
        const response = await fetch('/api/enter_phone', {
            // Body of the request is the JSON data we created above.
            body: JSON.stringify(data),
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // The method is POST because we are sending data.
            method: 'POST',
        })

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        if(result.status==='master') {
            console.log(result.name)
            dispatch(setmaster(result.name))
            router.push(`/master/${result.name}`)
            
        } else if (result.status === 'client') {
            console.log(result.name)
            dispatch(setclient(result.name))
            router.push(`/client/${result.name}`)
            
        } else {
             console.log("Error")
        }
        
        
    }
    return (
        <div className={styles.main}>
            <Header text="Вход" sel="/" />
            <section className={styles.section}>
                <div className={styles.inputs}>
                    <p>Используйте свой номер телефона как логин для входа на сайт.</p>
                    {/* <span>номер телефона</span> */}
                    <form onSubmit={handleSubmit} >
                        {/* <input type="tel" name="tel" pattern="[\+()]*(?:\d[\s\-\.()xX]*){10,14}"
                            required
                            minlength="11"
                            maxlength="13"
                        /> */}
                        <PhoneInput
                            onlyCountries={['by', 'ru', 'kz']}
                           
                            value={phone}
                           
                            prefix='+'
                           
                            placeholder='номер телефона'
                            onChange={phone => setPhone(phone)}
                        />
                        <button type="submit">Войти</button>
                    </form>
                    <h4>
                        Нажмая на кнопку, вы соглашаетесь с<br />
                        <b style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                            данных</b>  и <b style={{ color: "#3D4EEA" }}>Пользовательским соглашением</b>
                    </h4>
                </div>
            </section>


        </div>
    )
}