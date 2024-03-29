import { useSelector } from 'react-redux'

import styles from './calendar.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Message from '@/components/message'

import Menu_icon from '@/components/icons/menu'
import Link from 'next/link'
import Messages from '@/components/messages'
const activ_month = {
    color: '#282828',
}

import useSWR from 'swr'
import Succes from '../succesregistration'

export default function Calendar({ profile }) {
    const router = useRouter()
    const pro = useSelector(state => state.counter.profile)



    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map(i => i.toLowerCase())


    const d = new Date()

    const mon = d.getMonth()

    const [month, setMonth] = useState(mon)
    const my_months = [...months]
    const [active_day, setActive_Day] = useState()
    const [active_num, setActive_Num] = useState()


    const [monthSchedule, setMonthSchedule] = useState([])
    const [patern, setPatern] = useState([])
    const [viewPatern, setViewPatern] = useState(false)
    const [message, setMessage] = useState(false)
    const [orders, setOrders] = useState([])
    const [timeOrders, setTimeOrders] = useState([])

    const [curmonth, setcurmonth] = useState(d.getMonth() + 1)
    const [year, setyear] = useState(new Date().getFullYear())
    const all_days = new Date(year, curmonth, 0)


    const day = new Date(year, curmonth - 1, 1)
    let v = days.indexOf(days[day.getDay() - 1]) === -1 ? 6 : days.indexOf(days[day.getDay() - 1])

    const { data: old_patern } = useSWR(pro.nikname ? `/api/get_patern?nikname=${pro.nikname}` : null,
        { onSuccess: (old_patern) => { setPatern(old_patern) } }
    )


    function getOrders(a) {
        fetch(`/api/get_master_orders?nikname=${pro.nikname}&month=${a}&${year}`)
        .then(res => res.json())
        .then(res => setOrders(res))
    }

   

    useEffect(() => {
        if (!pro.nikname) {
            router.push('/')
            return;
        }

        // getPatern(pro.nikname)

    }, [])
    useEffect(() => {
        if (!pro) {
            router.push('/')
            return;
        }
        setActive_Day()
        setActive_Num()
        getOrders(month + 1)
        fetch(`/api/get_schedule?month=${my_months[curmonth]}&nikname=${pro.nikname}&year=${year}`)
            .then(res => res.json())
            .then(res => {
                if (res.length === 0) {
                    let new_arr = Array.from({ length: all_days.getDate() }, (v, i) => "")
                    setMonthSchedule(new_arr)
                } else {
                    setMonthSchedule(res)
                }
            })


    }, [curmonth, viewPatern])

    function SaveSchedule() {
        const data = {
            nikname: pro.nikname,
            month: my_months[curmonth].toLocaleLowerCase(),
            schedule: monthSchedule.map(i=> i ? i: ''),
            year: year
        }
        fetch('/api/edit_schedule', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res => {
            setMessage('Календарь сохранён')
            // getPatern()
            setTimeout(() => setMessage(false), 3000)
        })

    }

    function SetActiveTime(a) {
        if (!active_num) { return 0 }

        if (timeOrders.includes(a)) {
            setMessage('Время занято')

            setTimeout(() => setMessage(false), 2000)
            return;
        }

        let act_day = monthSchedule[active_num - 1]
        if (!act_day) {
            act_day = a
            monthSchedule[active_num - 1] = act_day
            setActive_Day(a)
            return setMonthSchedule([...monthSchedule])
        }
        if (act_day.split(',').some(i => i === a)) {
            let t = act_day.split(',').filter(i => i !== a).join()
            monthSchedule[active_num - 1] = t
            setActive_Day(t)
            return setMonthSchedule([...monthSchedule])
        } else {
            let t = act_day + ',' + a
            monthSchedule[active_num - 1] = t
            setActive_Day(t)
            return setMonthSchedule([...monthSchedule])
        }
    }

    function Count(day) {
        if (monthSchedule[day]) {
            let count = monthSchedule[day].split(',').length
            return count
        }
        return false
    }
    function setActiveDay(e) {
        let day_orders = orders.filter(i => i[0] === e.target.id).map(i => i[2])
        setTimeOrders(day_orders)
        if (monthSchedule[e.target.id - 1]) {
            let old_patern = monthSchedule[e.target.id - 1].split(',')
            const edit_patern = [...patern]
            let new_patern = [...new Set(edit_patern.concat(old_patern))].sort()
            setPatern(new_patern)
        } else {
            // getPatern()
        }
        setActive_Day(monthSchedule[e.target.id - 1])
        setActive_Num(e.target.id)
    }
    function set(a) {
        if (a === 1) {
            if (curmonth === 12) {
                setyear(year + 1)
            }
            setcurmonth(curmonth == 12 ? 1 : curmonth + 1)
        } else {
            if (curmonth === 1) {
                setyear(year - 1)
            }
            setcurmonth(curmonth == 1 ? 12 : curmonth - 1)
        }
    }



    return <>
        {Object.keys(pro).length > 0 && <>
            <header className={styles.header} >
            <Menu_icon type="/" color="#3D4EEA" />
                <h4>Календарь работы</h4>
                <span onClick={SaveSchedule}>Сохранить</span>
            </header>
            <Message page="calendar" text='Выбирайте дни и время, вы которые вы готовы
                принимать клиентов. При записи клиент  сможет
                выбрать только те дни и время, которые 
                вы указали рабочим.'
            />
            <section className={styles.section}>
                <div className={styles.month}>
                    <button onClick={() => set(-1)} >
                        {my_months[curmonth - 1]}
                    </button>
                    <button style={activ_month}>
                        {my_months[curmonth]}
                    </button>
                    <button onClick={() => set(1)} >
                        {my_months[curmonth === 12 ? 1 : curmonth + 1]}
                    </button>
                </div>
                <div className={styles.week}>
                    {days.map(i => <span key={i}>{i}</span>)}
                </div>
                <div className={styles.days} onClick={setActiveDay}>
                    {Array.from({ length: v }, (v, i) => i + 1).map(i =>
                        <span key={i} style={{ opacity: 0 }}>{i}</span>
                    )}
                    {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                        .map((i, index) =>
                            <button
                                key={i}
                                id={i}
                                style={{
                                    color: +active_num === i ? '#fff' : '#000',
                                    backgroundColor: +active_num === i ? "#3D4EEA" : "#ECEEFD"
                                }}
                            >{i}
                                <b
                                    className={styles.count}
                                    style={{
                                        backgroundColor: +active_num === i ? "#8B95F2" : "#3D4EEA",
                                        display: Count(index) ? 'inline-block' : 'none'
                                    }}
                                >{Count(index)}</b>
                            </button>
                        )}
                </div>
                <p>Время для записи</p>
                <div className={styles.time}>
                    {patern?.map((i) =>
                        <span
                            key={i}
                            style={active_day?.split(',').some(a => a === i) ?
                                { backgroundColor: "#3D4EEA", color: '#fff' } :
                                { backgroundColor: "#ECEEFD", color: '#000' }}
                            onClick={() => SetActiveTime(i)}
                        >
                            {i}
                        </span>
                    )}
                </div>
                {!viewPatern && <Link className={styles.button} href='/editpatern' >
                    Редактировать шаблон времени +
                </Link>}
            </section>
        </>}
        {message ? <Messages text={message} close={setMessage} /> : null}

    </>
}