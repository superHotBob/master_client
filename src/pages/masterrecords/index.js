import Header from '@/components/header'
import Link from 'next/link'
import styles from './records.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setorder } from '@/reduser'
import { Convert_Date } from '@/profile'


const activ_month = {
    color: '#282828',
}
const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
export default function Records() {
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const my_months = [...months]
    const d = new Date()
    const mon = d.getMonth() + 1

    const [month, setMonth] = useState(mon)
    const year = new Date().getFullYear()
    const day = new Date(year, month - 1, 1)
    let v = days.indexOf(days[day.getDay() - 1]) === -1 ? 6 : days.indexOf(days[day.getDay() - 1])

    const all_days = new Date(year, month, 0)
    const dispatch = useDispatch()
    const router = useRouter()
    const [selector, setSelector] = useState(true)
    const [active_day, setActive_Day] = useState()
    const [false_days, set_false_days] = useState([])
    const [all_orders, set_all_order] = useState([])
    const [orders, setOrders] = useState(null)
    const [profile, setProfile] = useState()


    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        if (!pro) {
            router.push('/')
            return;
        }
        setProfile(pro)
        if (orders) {
            return;
        } else {
            GetMasterOrders(pro)
        }
    }, [month])

    async function GetMasterOrders(a) {
        const response = await fetch(`/api/get_orders_master?nikname=${a.nikname}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'get',
        })
        const result = await response.json()
        const new_result = [...result]
        set_all_order(result)
        let month_result = new_result.filter(i => i.date_order.includes(months[month]))
        let flsd = month_result.map(i => +i.date_order.split(',')[0])
        set_false_days(flsd)
        setOrders(month_result)
    }

    function FilterDay(event) {
        setActive_Day(event.target.id)


        let result = all_orders
            .filter(i => +i.date_order.split(',')[0] === +event.target.id)
            .filter(i => i.date_order.split(',')[1] === my_months[month])
        setOrders(result)
    }
    function ViewOrder(a) {
        let current_order = orders.filter(i => i.id === a)
        dispatch(setorder(current_order[0]))
        router.push('/order/' + a)
    }

    function Count(a) {
        let s = false_days.filter(i => i === a).length
        return s
    }
    function SetMonth(e) {
        let m = my_months.findIndex(i => i === e.target.id)
        setMonth(m)
        let month_result = all_orders.filter(i => i.date_order.includes(e.target.id))
        setOrders(month_result)
        let flsd = month_result.map(i => +i.date_order.split(',')[0])
        set_false_days(flsd)
        setActive_Day()
    }

    function NewOrderText(a) {
        let date_order = a.split(',')
        let mon = my_months.indexOf(date_order[1]) - 1
        let d = new Date();
        console.log(mon, d.getMonth())
        if (mon >= d.getMonth() && +date_order[0] >= d.getDate()) {
            return true
        } else {
            return false
        }
    }

    return (
        <>
            {profile ? <>
                <Header sel="/" text="Записи на сеанс" color={profile.color} />
                <div className={styles.selector}>
                    <span
                        onClick={() => setSelector(true)}
                        style={selector ? { backgroundColor: profile.color[1], color: '#fff', fontWeight: 600 } : null}
                    >Записи на сеанс</span>
                    <span
                        onClick={() => setSelector(false)}
                        style={selector ? null : { backgroundColor: profile.color[1], color: '#fff', fontWeight: 600 }}
                    >История записей</span>
                </div>
                {selector ?
                    <section className={styles.section}>
                        <div className={styles.month} onClick={SetMonth}>
                            {months.splice(month ? month - 1 : 0, 3).map(i =>
                                <span key={i} id={i} style={i === my_months[month] ? activ_month : null} >{i}</span>
                            )}
                        </div>
                        <div className={styles.week}>
                            {days.map(i => <span key={i}>{i}</span>)}
                        </div>
                        <div className={styles.days} onClick={FilterDay}>
                            {Array.from({ length: v }, (a, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                            {Array.from({ length: all_days.getDate() }, (a, i) => i + 1)
                                .map(i =>
                                    <span
                                        id={i}
                                        key={i}
                                        style={+active_day === +i && Count(i) > 0 ? { backgroundColor: profile.color[1], color: '#fff' } : { backgroundColor: profile.color[2], color: profile.color[1] }}
                                    >
                                        {i}
                                        {Count(i) > 0 ?
                                            <b style={{ border: `2px solid ${profile.color[1]}`, backgroundColor: +active_day === +i ? profile.color[2] : profile.color[1], color: +active_day === +i ? profile.color[1] : profile.color[2], display: Count(i) ? 'inline-block' : 'none' }} className={styles.count}>
                                                {Count(i)}
                                            </b>
                                            : null}
                                    </span>
                                )}

                        </div>
                        <p className={styles.all_records}>
                            Все записи на сеансы
                            <span style={{ color: profile.color[1] }}>{active_day ? Convert_Date(` ${active_day},${my_months[month]},${'00:00'}`) : null}</span>
                        </p>
                        <Link
                            href={`/recordingtomaster?name=${profile.name}&nikname=${profile.nikname}`}
                            style={{ backgroundColor: profile.color[1] }}
                        >Добавить запись +</Link>
                        {orders?.map(i =>
                            <div
                                onClick={() => ViewOrder(i.id)}
                                key={i.id}
                                className={styles.order}
                            >
                                <p>
                                    <span className={i.read ? null : styles.active}>
                                        {Convert_Date(i.date_order)}
                                    </span>
                                    <span>#{i.id}</span>
                                </p>
                                <h3>
                                    <span style={{ color: profile.color[1] }}>
                                        {i.client === i.master ? <b>Мой заказ</b> : i.client_name}
                                    </span>
                                    <span style={{ color: profile.color[1] }}>{i.price} BYN</span>
                                </h3>
                                <h6 style={{ color: profile.color[1] }}>
                                    {i.neworder.replace(/[0-9]/g, ' ').replace(/:/g, ' ')}
                                </h6>
                            </div>
                        )}

                    </section>
                    :
                    <section className={styles.section}>
                        {all_orders.sort((a, b) => a.id - b.id < 0 ? 1 : -1).map(i =>
                            <div
                                onClick={() => router.push('/order/' + i.id)}
                                key={i.id}
                                className={styles.order}
                            >
                                <p>
                                    <span className={i.read ? null : styles.active}>
                                        {Convert_Date(i.date_order)}
                                    </span>
                                    <span>#{i.id}</span>
                                </p>
                                <h3>
                                    <span style={{ color: profile.color[1] }}>
                                        {i.client_name || i.client}
                                    </span>
                                    <span style={{ color: profile.color[1] }}>{i.price} BYN</span>
                                </h3>
                                <h6 style={{ color: profile.color[1] }}>{i.neworder.replace(/[0-9]/g, '  ').replace(/:/g, ' ')}</h6>
                            </div>
                        )}

                    </section>
                }

            </> : null}

        </>
    )
}