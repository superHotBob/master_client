import styles from './enter.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'

export default function EnterCode({back}) {

    const dispatch = useDispatch()
    const router = useRouter()
    const { my_phone } = useSelector(state => state.counter)
    
    
    const [number, setNumber] = useState([, , ,])
    // const [back, setBack] = useState('logo-main.svg')
    const [select, setSelect] = useState('Вход')
    const [message, setMessage] = useState('')
    const [t, setT] = useState(30)

    const timeRef = useRef()

    useEffect(() => {
        document.getElementById(1).focus()
        timeRef.current = setInterval(()=>setT((prev)=>prev > 0 ? prev-1 : clearInterval(timeRef.current) ),1000)      
        return ()=>clearInterval(timeRef.current)
    }, [])

    async function checkClient() {     
        fetch(`/api/check_client?phone=${my_phone}`)
            .then(res => res.json())
            .then(res => {
                if (res.length === 0) {
                   passwordControl()
                } else if (res[0].blocked != '0') {
                    router.push('/enter')
                } else {
                    passwordControl()
                }
            })
    }
    const passwordControl = async () => {
        const data = { tel: +my_phone, password: '0000000000' }


        const response = await fetch('/api/enter_password', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
        })
        const result = await response.json()

        localStorage.setItem("profile", JSON.stringify(result))
        dispatch(setprofile(result))
        // if (result.city) {
        //     dispatch(setcity(result.city))
        // }
        saveToHistory(result)
        router.push('/')

    }

    async function saveToHistory() {
        let responce = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=ecc713e733a64a24bd32521c2f47be98&fields=city,ip_address')
        let data = await responce.json()
        fetch(`/api/save_history?phone=${my_phone}&city=${data.city}&ip_address=${data.ip_address}`)      
    }

    async function sendCode() {
        const data = { tel: my_phone, number: number.join('') }       
        if (number.length != 5) { return; }
        fetch('/api/get_code', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {
                if (res.status === 200) {
                    checkClient()
                } else if (res.status === 404) {
                    setSelect('Подтвердить')
                    setMessage('Не верный код')
                } else if (res.status === 429) {
                    setMessage('Вы исчерпали лимит попыток')
                    setT(60)
                } else {
                    setMessage('Не верный код')
                }
            })
    }

    const handleKeyDown = (e, b) => {
        if (e.key === 'Backspace') {
            if (b === 1) {
                document.getElementById("1").value = null
                return;
            }
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
        if (e.key === 'Backspace') {
            return;
        }
        if (b === 4) {
            let nmb = number
            nmb[b] = e.target.value
            setNumber(nmb)
            return;
        }
        let nmb = number
        nmb[b - 1] = e.target.value
        setNumber(nmb)
        if (+e.target.value >= 0 && b < 4) {
        document.getElementById(b + 1).focus()
        }
    }
    function Reload() {
        back('Вход')
        setNumber([, , ,])        
        setMessage('')
    }

    return (
        <div className={styles.number}>
            <p>
                Введите последние 4 цифры водящего номера.<br />
                Отвечать на звонок не нужно. Звоним на <br />
                указанный номер:
            </p>
            <h4>+{my_phone}</h4>
            <h5>Например +7 XXX XXX  <span>12 34</span></h5>
            <div className={styles.numbers} >
                {[1, 2, 3, 4].map(i =>
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
                    />)}
            </div>
            {message ?
                <>
                    <h3 className={styles.error}>Не верный код</h3>
                    <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                </>
                :
                <>
                    <div className={styles.button} onClick={sendCode}>Подтвердить</div>
                    <h6>Не получили звонок?</h6>

                </>
            }
            <button disabled={t > 0 ? true : false} className={styles.my_button} onClick={Reload}>
                Повторить попытку  {t ? <b>через {t} cek.</b> : null}
            </button>
        </div>

    )
}