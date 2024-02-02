import Header from '@/components/header'
import Link from 'next/link'
import styles from './records.module.css'
import { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { my_tema } from '@/data.'
import Order from '@/components/order'
import { months, week } from '@/profile'
import HistoryOrders from '@/components/allorders'


const activ_month = {
    color: '#282828',
}

export default function Records() {


    const d = new Date()

    const [selector, setSelector] = useState(true)
    const [active_day, setActive_Day] = useState()
    const [false_days, set_false_days] = useState([])

    const [orders, setOrders] = useState(null)
    const [profile, setProfile] = useState()


    const [curmonth, setcurmonth] = useState(d.getMonth() + 1)
    const [year, setyear] = useState(new Date().getFullYear())
    const all_days = new Date(year, curmonth, 0)
    const day = new Date(year, curmonth - 1, 1)

 

    let v = week.indexOf(week[day.getDay() - 1]) === -1 ? 6 : week.indexOf(week[day.getDay() - 1])

  

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
        fetch(`/api/get_orders_master?nikname=${pro.nikname}&month=${curmonth}&year=${year}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(res => {
                const new_result = [...res]
                let month_result = new_result.filter(i => i.date_order.includes(months[curmonth]))
                let flsd = month_result.map(i => +i.date_order[0])
                set_false_days(flsd)
                setOrders(res)
            })
    }, [curmonth, year])


    const FilterDay = e => {
        setActive_Day(+e.target.id)

    }

    function Count(a) {
        let s = orders?.filter(i => +i.date_order[0] === a).length
        return s
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
        setActive_Day()
        setActive_Day()
    }




    return (
        <>
            {profile && <>
                <Header sel="/" text="Записи на сеанс" col={my_tema[profile.tema].color} />
               
                <div className={styles.selector}>
                    <span
                        onClick={() => setSelector(true)}
                        style={selector ? { backgroundColor: my_tema[profile.tema].color[1], color: '#fff', fontWeight: 600 } : null}
                    >Записи на сеанс</span>
                    <span
                        onClick={() => setSelector(false)}
                        style={selector ? null : { backgroundColor: my_tema[profile.tema].color[1], color: '#fff', fontWeight: 600 }}
                    >История записей</span>
                </div>
                {selector ?
                    <section className={styles.section}>
                        <div className={styles.month}>
                            <button onClick={() => set(-1)}>
                                {months[curmonth - 1]}
                            </button>
                            <button style={activ_month}>
                                {months[curmonth]}
                            </button>
                            <button onClick={() => set(1)}>
                                {months[curmonth === 12 ? 1 : curmonth + 1]}
                            </button>
                        </div>
                        <div className={styles.week}>
                            {week.map(i => <span key={i}>{i}</span>)}
                        </div>
                        <div className={styles.days} onClick={FilterDay}>
                            {Array.from({ length: v }, (a, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                            {Array.from({ length: all_days.getDate() }, (a, i) => i + 1)
                                .map(i =>
                                    <span
                                        id={i}
                                        key={i}
                                        style={+active_day === +i && Count(i) > 0 ? { backgroundColor: my_tema[+profile.tema].color[1], color: '#fff' } : { backgroundColor: my_tema[+profile.tema].color[2], color: my_tema[+profile.tema].color[1] }}
                                    >
                                        {i}
                                        {Count(i) > 0 ?
                                            <b style={{
                                                backgroundColor: +active_day === +i ? my_tema[+profile.tema].color[2] : my_tema[+profile.tema].color[1],
                                                color: +active_day === +i ? my_tema[+profile.tema].color[1] : '#fff',
                                                display: Count(i) ? 'inline-block' : 'none'
                                            }}
                                                className={styles.count}
                                            >
                                                {Count(i)}
                                            </b>
                                            : null}
                                    </span>
                                )}

                        </div>
                        <p className={styles.all_records}>
                            Все записи на сеансы
                            {Count(active_day) > 0 ? <span style={{ color: my_tema[+profile.tema].color[1] }}>
                                {active_day ? months[curmonth] + " , " + active_day : null}
                            </span> : null}
                        </p>
                        <Link
                            href={`/recordingtomaster?name=${profile.name}&nikname=${profile.nikname}`}
                            style={{ backgroundColor: my_tema[+profile.tema].color[1] }}
                        >Добавить запись +</Link>
                        {orders?.filter(i => +i.date_order[0] === active_day).map(i => <Order order={i} key={i.id} profile={profile.tema} />)}
                    </section>
                    :
                    <HistoryOrders profile={profile} />
                }
            </>}

        </>
    )
}