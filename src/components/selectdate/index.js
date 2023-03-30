import styles from './selectdate.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import arrow from '../../../public/arrow_back.svg'
import Image from 'next/image'
const active = {
    backgroundColor: '#3D4EEA',
    color: '#fff'
}
const false_day = {
    backgroundColor: '#fff',
    color: '#d0d0d0',
    border: '1px solid #d0d0d0'
}

export default function SelectDate({name,price,order,close}) {
    const false_days = [2, 6, 10, 16, 25, 30]
    const false_times = [13, 15, 18, 20]
    const days = ["вс" ,"пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь']

    const d = new Date()
    const mon = d.getMonth()
    const [month, setMonth] = useState(mon)
    const [month_one, set_month_one] = useState(0)    
    const [active_day, setActive_Day] = useState()
    const [active_time, setActive_Time] = useState()
    const [saved, setSaved] = useState(false)
    const all_days = new Date(2023, month, 0)   
    const profile = useSelector(state=>state.counter.profile)

    function MyDate(a) {
        const day = new Date(2023, month - 1, a)
        return a + ' ' + days[day.getDay()]
    }
    function Next(a) {
        if(month_one === 0 && a === 1){
            set_month_one(1)
        } else if (month_one === 1 && a === 1) {
            set_month_one(0)
            setMonth(month + a)
        } else if (month_one === 0 && a === -1){
            set_month_one(1)
            setMonth(month + a)
        } else if (month_one === 1 && a === -1) {
            set_month_one(0)
        }        
    }
    useEffect(()=>{
        const SaveOrder = async () => {
            const data = {           
                client: profile.nikname,
                master: name,
                price: price,
                order: order,
                date: `${active_day},${months[month]},${active_time}`,            
            }
            const response = await fetch('/api/save_order', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
            const result = await response.json()
            setSaved(false)
            console.log('Save order',result)
          
        }
        if(active_day && active_time ) {
            SaveOrder()
            setSaved(true)
        } else {
            return
        }

    },[order])
   
    function Set_Active_Day(a){
        if(false_days.includes(a)) {
            return
        } else {
            setActive_Day(a)
        }
    }
    function Set_Active_Time(a){
        if(false_times.includes(a)) {
            return
        } else {
            setActive_Time(a)
        }
    }
    return (
        <main className={styles.main}>
            <div className={styles.head}>
                <span onClick={()=>close(true)}/>
                <span>Запись к мастеру</span>
            </div>
            <h3>Ближайшие даты</h3>
            <h4>{months[month]}</h4>
            <div className={styles.all_days}>
                <div className={styles.left} onClick={() => Next(-1)}></div>
                <div className={styles.days}>
                    {Array.from({ length: Math.ceil(all_days.getDate()/2) }, (v, i) => i + 1 + month_one*Math.trunc(all_days.getDate()/2))
                        .map(i =>
                            <span
                                onClick={() => Set_Active_Day(i)}
                                key={i}
                                style={active_day === i ? active : (false_days.includes(i) ? false_day : null)}

                            >{MyDate(i)}</span>
                        )}
                </div>
                <div className={styles.right} onClick={() => Next(1)}></div>
            </div>
            <h3>Свободное время</h3>
            <div className={styles.time}>
                {Array.from({ length: 13 }, (v, i) => i + 10)
                    .map((i) =>
                        <span
                            onClick={() => Set_Active_Time(i)}
                            key={i}
                            style={active_time === i? active : (false_times.includes(i) ? false_day : { backgroundColor: '#ECEEFD' })}>{i}{' '}:{' '} 00
                        </span>
                    )}
            </div>
            {saved ? <div className={styles.await}>
                    <Image alt="await" src='/await.gif' width={150} height={150} />
                </div>: null}
            {/* <div className={styles.submit} onClick={()=>SaveOrder()}>Записаться</div> */}
        </main>
    )
}