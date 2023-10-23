import Header from '@/components/header'
import Link from 'next/link'
import styles from './records.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Convert_Date } from '@/profile'
import { my_tema } from '@/data.'
import Order from '@/components/order'
import { months,week } from '@/profile'
import AllOrders from '@/components/allorders'


const activ_month = {
    color: '#282828',
}

export default function Records() {
    // const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const my_months = [...months]
    const d = new Date()
    const mon = d.getMonth() + 1

    const [month, setMonth] = useState(mon)
   
    

   
    const [selector, setSelector] = useState(true)
    const [active_day, setActive_Day] = useState()
    const [false_days, set_false_days] = useState([])
    const [all_orders, set_all_order] = useState([])
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
        GetMasterOrders(pro)       
    }, [curmonth])

    async function GetMasterOrders(a) {
        const response = await fetch(`/api/get_orders_master?nikname=${a.nikname}&month=${curmonth}&year=${year}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'get',
        })
        const result = await response.json()
        const new_result = [...result]       
        let month_result = new_result.filter(i => i.date_order.includes(months[curmonth]))
        let flsd = month_result.map(i => +i.date_order.split(',')[0])
        set_false_days(flsd)
        setOrders(result)
    }

    function FilterDay(event) {
        setActive_Day(event.target.id)       
        let result = all_orders
        .filter(i => +i.date_order.split(',')[0] === +event.target.id)
        .filter(i => (i.date_order.split(',')[1]).toLowerCase() === my_months[curmonth])
        setOrders(result)
    }


    function Count(a) {
        let s = false_days.filter(i => i === a).length
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
        let month_result = all_orders.filter(i => i.date_order.includes(curmonth))
        setOrders(month_result)
        let flsd = month_result.map(i => +i.date_order.split(',')[0])
        set_false_days(flsd)
        setActive_Day()
        
      
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



    return (
        <>
            {profile && <>
                <Header sel="/" text="Записи на сеанс" color={my_tema[+profile.tema].color} />
                <div className={styles.selector}>
                    <span
                        onClick={() => setSelector(true)}
                        style={selector ? { backgroundColor: my_tema[+profile.tema].color[1], color: '#fff', fontWeight: 600 } : null}
                    >Записи на сеанс</span>
                    <span
                        onClick={() => setSelector(false)}
                        style={selector ? null : { backgroundColor: my_tema[+profile.tema].color[1], color: '#fff', fontWeight: 600 }}
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
                                            }} className={styles.count}>
                                                {Count(i)}
                                            </b>
                                            : null}
                                    </span>
                                )}

                        </div>
                        <p className={styles.all_records}>
                            Все записи на сеансы
                            <span style={{ color: my_tema[+profile.tema].color[1] }}>{active_day ? Convert_Date(` ${active_day},${my_months[curmonth-1]},${'00:00'}`) : null}</span>
                        </p>
                        <Link
                            href={`/recordingtomaster?name=${profile.name}&nikname=${profile.nikname}`}
                            style={{ backgroundColor: my_tema[+profile.tema].color[1] }}
                        >Добавить запись +</Link>
                        {orders?.map(i => <Order order={i} key={i.id} profile={profile.tema} />)}
                    </section>
                    : <AllOrders profile={profile} />
                }
            </>}

        </>
    )
}