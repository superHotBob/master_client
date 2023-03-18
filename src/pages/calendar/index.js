import Header from '@/components/header'
import styles from './calendar.module.css'
import Image from 'next/image'
import close from '../../../public/close.svg'
import { useState } from 'react'

const activ_month = {
    width: '55%',
    color: '#282828',
}
const active = {
    backgroundColor: '#8B95F2',   
}
const false_mo = {
    backgroundColor: '#fff',
    color: '#d0d0d0',
    border: '1px solid #d0d0d0'
}

export default function Calendar() {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['январь','февраль','март','апрель','май','июнь','июль','август','сетнябрь',
        'октябрь','ноябрь','декабрь']
    const false_days = [10, 16, 30]
    const false_times = [13, 15, 18, 20]
    const d = new Date()
    const mon = d.getMonth()
    const [month, setMonth] = useState(mon)
    const all_days = new Date(2023, month + 3, 0)

    const [active_day, setActive_Day] = useState()

    function MyDate(a) {
        const day = new Date(2023, month + 3, a)
        return a + ' ' + days[day.getDay()]
    }

    return (
        <main className={styles.main}>
            <Header sel="/" text="Календарь работы" />
            <section className={styles.section}>
                <div className={styles.message} >
                    <Image alt="picture" src={close} height={10} width={10} />
                    Выбирайте дни и время, вы которые вы готовы<br />
                    принимать клиентов. При записи елиен  сможет<br />
                    выбрать только те дни и время, которые <br />
                    вы указали рабочим.
                </div>                
                    <div className={styles.mounth}>
                        {[months[mon],months[mon+1], months[mon+2]].map((i, index) =>
                            <span onClick={() => setMonth(index)} style={index === month ? activ_month : null} key={i}>{i}</span>
                        )}
                    </div>                
                <div className={styles.days}>
                    {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)                    
                    .map(i =>
                        <span 
                            onClick={()=>setActive_Day(i)} 
                            key={i} 
                            style={false_days.includes(i) ? false_mo : active_day === i ? active : null}
                        >{MyDate(i)}</span>
                    )}

                </div>
                
                <p>Время для записи</p>
                <div className={styles.time}>
                    {Array.from({ length: 13 }, (v, i) => i + 10).map((i) =>
                        <span key={i} style={false_times.includes(i) ? false_mo : null}>{i}{' '}:{' '} 00</span>
                    )}

                </div>
                <button>
                    <span>
                        Редактировать шаблон времени
                    </span>
                </button>
            </section>
        </main>
    )
}