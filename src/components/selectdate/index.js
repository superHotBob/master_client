import styles from './selectdate.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
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

export default function SelectDate({ name, price, order, close, nikname }) {
    // const false_days = [2, 6, 10, 16, 25, 30]
    // const false_times = [13, 15, 18, 20]
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь']

    const d = new Date()
    const mon = d.getMonth()
    const [month, setMonth] = useState(mon)
    const [month_one, set_month_one] = useState(0)
    const [false_times, set_false_time] = useState([])
    const [false_days, set_false_days] = useState([5,19])
    const [false_date, set_false_date] = useState()
    const [active_day, setActive_Day] = useState()
    const [active_time, setActive_Time] = useState()

    const [saved, setSaved] = useState(false)
    const [goodorder, setgoodorder] = useState(false)

    const all_days = new Date(2023, month, 0)
    const profile = useSelector(state => state.counter.profile)

    function MyDate(a) {
        const day = new Date(2023, month - 1, a)
        return a + ' ' + days[day.getDay()]
    }

    async function GetDate() {
        const response = await fetch(`/api/date_services_master?master=${nikname}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'get',
        })
        const result = await response.json()
        let new_result = result.map(i => i.date_order.split(','))
        set_false_date(new_result)
    }


    function Next(a) {

        if (month_one === 0 && a === 1) {
            set_month_one(1)
        } else if (month_one === 1 && a === 1) {
            set_month_one(0)
            setMonth(month + a)
            // let fls = false_date.filter(i=>i[1] === months[month + a]).map(i=>+i[0])
            // set_false_days(fls)

        } else if (month_one === 0 && a === -1) {
            set_month_one(1)
            setMonth(month + a)
            // let fls = false_date.filter(i=>i[1] === months[month + a]).map(i=>+i[0])
            // set_false_days(fls)

        } else if (month_one === 1 && a === -1) {
            set_month_one(0)
        }
    }
    useEffect(() => {
        setMonth(mon + 1)
        const SaveOrder = async () => {
            const data = {
                client: profile.nikname,
                master: nikname,
                master_name: name,
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
            setgoodorder(true)

        }
        if (active_day && active_time) {
            SaveOrder()
            setSaved(true)
        } else {
            GetDate()
        }
    }, [order])

    function Set_Active_Day(a) {
        if (false_days.includes(a)) {
            return
        } else {
            setActive_Day(a)
            let flsT = false_date.filter(i => i[1] === months[month]).filter(i => +i[0] === a).map(i => +i[2])
            set_false_time(flsT)
            console.log(flsT)
        }
    }
    function Set_Active_Time(a) {
        if (false_times.includes(a)) {
            return
        } else {
            setActive_Time(a)
        }
    }
    return (
        <>
            <div className={styles.head}>
                <span onClick={() => close(true)} />
                <span>Запись к мастеру</span>
            </div>
            <h3 className={styles.date}>Ближайшие даты</h3>
            <h4 className={styles.month}>{months[month]}</h4>
            <div className={styles.all_days}>
                <div className={styles.left} onClick={() => Next(-1)}></div>
                <div className={styles.days}>
                    {Array.from({ length: Math.ceil(all_days.getDate() / 2) }, (v, i) => i + 1 + month_one * Math.trunc(all_days.getDate() / 2))
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
            <h3 className={styles.date}>Свободное время</h3>
            <div className={styles.time}>
                {Array.from({ length: 13 }, (v, i) => i + 10)
                    .map((i) =>
                        <span
                            onClick={() => Set_Active_Time(i)}
                            key={i}
                            style={active_time === i ? active : (false_times.includes(i) ? false_day : { backgroundColor: '#ECEEFD' })}>{i}{' '}:{' '} 00
                        </span>
                    )}
            </div>
            {saved ? <div className={styles.await}>
                <Image alt="await" src='/await.gif' width={150} height={150} />
            </div> : null}
            {goodorder ? <div className={styles.goodorder}>
                <h3>master.place</h3>
                <h1>УСПЕШНО</h1>
                <h4>
                    Заказ создан, свяжитесь с мастером, что-бы <br /> не потерять друг-друга.
                </h4>
                <Link href="/chat" >Открыть чат с мастером</Link>
                <h6 onClick={() => setgoodorder(false)}>Закрыть</h6>
            </div> : null}
        </>
    )
}