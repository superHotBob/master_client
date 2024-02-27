import Header from '@/components/header'
import styles from '../enter/enter.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'
import 'react-phone-input-2/lib/style.css'


export default function enterCode() {

    const dispatch = useDispatch()
    const router = useRouter()
    const { my_phone } = useSelector(state => state.counter)
    const [number, setNumber] = useState([, , ,])
    const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')
    const [message, setMessage] = useState('')
    const [t, setT] = useState(15)

    const myref = useRef()


    useEffect(() => {
        document.getElementById('1').focus()
      
       
        if(t  > 0) {
            setT(t)
        }        
        myref.current = setInterval(() => {            
            setT((prev) => prev > 0 ? prev - 1 : clearInterval(myref.current))          
        }, 1000)       
        return () => clearInterval(myref.current)
    }, [])
   

    // async function Call() {
    //     console.log('Call')
    //     setT(30)
    //     clearInterval(myref.current)
    //     document.getElementById('1').focus()
    //     myref.current = setInterval(() => {            
    //         setT((prev) => prev > 0 ? prev - 1 : clearInterval(myref.current))          
    //     }, 1000)       
    //     // const res_ip = await fetch('https://api.ipgeolocation.io/getip')
    //     // const ip = await res_ip.json()
    //     // const data = { tel: +my_phone, ip: ip.ip }
    //     // const res = await fetch(`/api/get_code`, {
    //     //     body: JSON.stringify(data),
    //     //     headers: {
    //     //         'Content-Type': 'application/json',
    //     //     },
    //     //     method: 'POST',
    //     // })
    // }
    const handleSubmit = async () => {
        const data = { tel: +my_phone, password: null }
        const response = await fetch('/api/enter_password', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
        })
        const result = await response.json()

        localStorage.setItem("profile", JSON.stringify(result))
        localStorage.removeItem("t")
        dispatch(setprofile(result))
        // if (result.city) {
        //     dispatch(setcity(result.city))
        // }
        // saveToHistory(result)
        router.push('/')

    }
    async function checkClient() {
        fetch(`/api/check_client?phone=${my_phone}`)
            .then(res => res.json())
            .then(res => handleSubmit())
    }

    async function sendCode() {
        console.log(number, number.join(''))
        if (+number.join('').length < 4) {
            return
        }
        const data = { tel: my_phone, number: number.join('') }

        console.log(data.tel)
        if(!data.tel) {
            router.push('enter')
        }

        fetch('/api/get_code_first', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {
                if (res.status === 200) {
                    // checkClient()
                } else if (res.status === 404) {
                    setSelect('Подтвердить')
                    setMessage('Не верный код')
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
            // if (b === 1) {
            //     document.getElementById("1").value = null
            //     return;
            // }
            if (e.target.value != '') {
                document.getElementById(b).value = null
            } else {
                document.getElementById(b - 1).focus()
            }

        }
        if (e.key === 'Enter' && b === 4) {
            sendCode()
        }
    };

    function Number(e, b) {
        console.log(number, b)
        if (e.key === 'Backspace') {
            return;
        }
        if (b === 4) {
            let nmb = number
            nmb[3] = +e.target.value
            setNumber(nmb)
            return;
        }
        let nmb = number
        nmb[b - 1] = +e.target.value
        setNumber(nmb)
        if ( b < 4) {
            document.getElementById(b + 1).focus()
        }
    }


    return (
        <section className={styles.section} style={{ backgroundImage: `url(${back})` }}>
            <Header text="Ввод кода" sel="back" />
            <div className={styles.number}>
                <p>
                    Введите последние 4 цифры водящего номера.<br />
                    Отвечать на звонок не нужно. Звоним на <br />
                    указанный номер:
                </p>
                <h4>+{my_phone}</h4>
                <h5>Например +7 XXX XXX  <span>12 34</span></h5>
                <div className={styles.numbers} >
                    <input
                        id={1}
                        key={1}
                        pattern="[0-9]*"
                        type="text"
                        inputMode='numeric'
                        required                       
                        maxLength={1}
                        onChange={(e) => Number(e, 1)}
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                    />
                    {[2, 3, 4].map(i =>
                        <input
                            id={i}
                            key={i}
                            pattern="[0-9]*"
                            type="text"
                            inputMode='numeric'
                            required
                            maxLength={1}
                            onChange={(e) => Number(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                    )}
                </div>
                {message ?
                    <>
                        <h3 className={styles.error}>Не верный код</h3>
                        <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                    </>
                    :
                    <>
                        <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                        <h6>Не получили звонок ?</h6>

                    </>
                }
                <button
                    disabled={t ? true : false}
                    className={styles.my_button}
                    onClick={()=>router.push('/enter')}
                >
                    Повторный звонок {t ? <b >возможен через {t} сек.</b> : null}
                </button>
            </div>
        </section>

    )
}