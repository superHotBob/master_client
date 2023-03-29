import Header from '@/components/header'
import styles from './calendar.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Message from '@/components/message'

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

    const false_days = [10, 16, 30]
    const false_times = [13, 15, 18, 20]

    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь', 'Декабрь']
    
    const d = new Date()
    const mon = d.getMonth() + 1   
    const [month, setMonth] = useState(mon)
    const my_months = [...months]
    const [active_day, setActive_Day] = useState()
    const all_days = new Date(2023, month, 0)

    const [profile, setProfile] = useState()

    function MyDate(a) {
        const day = new Date(2023, month + 3, a)
        return a + ' ' + days[day.getDay()]
    }
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
    }, [])

    function SetMonth(a) {
        let m = my_months.findIndex(i => i === a)
        setMonth(m)
    }
    return (
        <main className={styles.main}>
            {profile ? <>
                <Header sel="/" text="Календарь работы" color={profile.color} />
                <section className={styles.section}>
                    <Message text={`
                    Выбирайте дни и время, вы которые вы готовы
                    принимать клиентов. При записи елиен  сможет
                    выбрать только те дни и время, которые 
                    вы указали рабочим.
                    `} color={profile.color}
                    />
                    <div className={styles.mounth}>
                        {months.splice(month ? month - 1 : 0, 3).map((i, index) =>
                            <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                        )}
                    </div>
                    <div className={styles.days}>
                        {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                            .map(i =>
                                <span
                                    onClick={() => setActive_Day(i)}
                                    key={i}
                                    style={false_days.includes(i) ? false_mo : active_day === i ? { backgroundColor: profile.color[2] } : { backgroundColor: profile.color[1] }}
                                >{MyDate(i)}</span>
                            )}
                    </div>
                    <p>Время для записи</p>
                    <div className={styles.time}>
                        {Array.from({ length: 13 }, (v, i) => i + 10).map((i) =>
                            <span key={i} style={false_times.includes(i) ? false_mo : { backgroundColor: profile.color[1] }}>{i}{' '}:{' '} 00</span>
                        )}
                    </div>
                    <button style={{ backgroundColor: profile.color[2] }}>
                        <span style={{ color: profile.color[1] }}>
                            Редактировать шаблон времени +
                        </span>
                    </button>
                </section>
            </> : null}
        </main>
    )
}