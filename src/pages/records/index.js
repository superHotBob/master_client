import Header from '@/components/header'
import styles from './records.module.css'
import Image from 'next/image'
import close from '../../../public/close.svg'
import { useState } from 'react'

const activ_month = {
    width: '55%',
    color: '#282828',
}
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}
const active = {
    backgroundColor: '#8B95F2',
}
const false_mo = {
    backgroundColor: '#fff',
    color: '#d0d0d0',
    border: '1px solid #d0d0d0'
}

const records = [
    { date: 1679156076446, orders: [2345, 2478, 2588] },
    { date: 1679156176446, orders: [2375] },
    { date: 1679156276446, orders: [2558] },
]

export default function Records() {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сетнябрь',
        'октябрь', 'ноябрь', 'декабрь']
    const false_days = [10, 16, 30]

    const d = new Date()
    const mon = d.getMonth()
    const [month, setMonth] = useState(mon)
    const all_days = new Date(2023, month + 3, 0)
    const [selector, setSelector] = useState(0)
    const [active_day, setActive_Day] = useState()

    function MyDate(a) {
        const day = new Date(2023, month + 1, a)
        return a + ' ' + days[day.getDay()]
    }

    return (
        <main className={styles.main}>
            <Header sel="/" text="Записи на сеанс" />
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Записи на сеанс</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>История записей</span>
            </div>
            {selector ?
                <section className={styles.section}>
                    <div className={styles.mounth}>
                        {[months[mon], months[mon + 1], months[mon + 2]].map((i, index) =>
                            <span onClick={() => setMonth(index)} style={index === month ? activ_month : null} key={i}>{i}</span>
                        )}
                    </div>
                    <div className={styles.days}>
                        {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                            .map(i =>
                                <span
                                    onClick={() => setActive_Day(i)}
                                    key={i}
                                    style={!false_days.includes(i) ? false_mo : active_day === i ? active : null}
                                >{MyDate(i)}</span>
                            )}

                    </div>
                    <p>Все записи на сеансы</p>
                    <button>
                        <span>
                            Добавить запись
                        </span>
                    </button>
                </section> : null }
        </main>
    )
}