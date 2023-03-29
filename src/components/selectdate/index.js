import styles from './selectdate.module.css'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const active = {
    backgroundColor: '#3D4EEA',
    color: '#fff'
}
const false_day = {
    backgroundColor: '#fff',
    color: '#d0d0d0',
    border: '1px solid #d0d0d0'
}

export default function SelectDate({name,price,order}) {
    const false_days = [2, 6, 10, 16, 25, 30]
    const false_times = [13, 15, 18, 20]
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь']

    const d = new Date()
    const mon = d.getMonth() + 1
    const [month, setMonth] = useState(mon)    
    const [active_day, setActive_Day] = useState()
    const [active_time, setActive_Time] = useState()
    const all_days = new Date(2023, month, 0)
    const profile = useSelector(state=>state.counter.profile)

    function MyDate(a) {
        const day = new Date(2023, month + 3, a)
        return a + ' ' + days[day.getDay()]
    }
    function Next(a) {
        setMonth(month + a)
    }
    const SaveOrder = async () => {
        const data = {           
            client: profile.nikname,
            master: name,
            price: 1200,
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
        console.log('Save order',result)
      
    }
    return (
        <main className={styles.main}>
            <h3>Ближайшие даты</h3>
            <h4> <div className={styles.left} onClick={() => Next(-1)}></div>
            {months[month]}
            <div className={styles.right} onClick={() => Next(1)}></div>
            </h4>
            <div className={styles.all_days}>
               
                <div className={styles.days}>
                    {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                        .map(i =>
                            <span
                                onClick={() => setActive_Day(i)}
                                key={i}
                                style={active_day === i ? active : (false_days.includes(i) ? false_day : null)}

                            >{MyDate(i)}</span>
                        )}
                </div>
                
            </div>
            <h3>Свободное время</h3>
            <div className={styles.time}>
                {Array.from({ length: 13 }, (v, i) => i + 10)
                    .map((i) =>
                        <span
                            onClick={() => setActive_Time(i)}
                            key={i}
                            style={active_time === i? active : (false_times.includes(i) ? false_day : { backgroundColor: '#ECEEFD' })}>{i}{' '}:{' '} 00
                        </span>
                    )}
            </div>
            <div className={styles.submit} onClick={()=>SaveOrder()}>Записаться</div>
        </main>
    )
}