import styles from './selectdate.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'

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
const activ_month = {
    color: '#282828',
}

export default function SelectDate({ name, price, order, close, nikname }) {
   
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const months = ['Декабрь','Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь', 'Декабрь'
    ]

    const d = new Date()
    const mon = d.getMonth() + 1
    const [month, setMonth] = useState(mon)
    const my_months = [...months]
    const [month_one, set_month_one] = useState(0)
    const [false_times, set_false_time] = useState([])
    const [false_days, set_false_days] = useState([])
    const [false_date, set_false_date] = useState()
    const [active_day, setActive_Day] = useState()
    const [active_time, setActive_Time] = useState()

    const [saved, setSaved] = useState(false)
    const [goodorder, setgoodorder] = useState(false)

    const [patern, setPatern] = useState([])
    const [schedule, setSchedule] = useState([])
    const [orders, setOrders] = useState([])
    
    const all_days = new Date(2023, month, 0)
    const profile = useSelector(state => state.counter.profile)
    const year = new Date().getFullYear()
    const day = new Date(year, month - 1, 1)
    let v = days.indexOf(days[day.getDay() - 1])
    
   
    // async function GetDate() {
    //     const response = await fetch(`/api/date_services_master?master=${nikname}`, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'get',
    //     })
    //     const result = await response.json()
    //     let new_result = result.map(i => i.date_order.split(','))
    //     set_false_date(new_result)
    // }

    useEffect(()=>{
       
        let day = d.getDate()
        let all_day = Array.from({length: day}, (v,i)=>i+1)        
        set_false_days(all_day) 
           
        fetch(`/api/get_patern?nikname=${nikname}`)
        .then(res => res.json())
        .then(res => setPatern(res))
        fetch(`/api/get_schedule?nikname=${nikname}&month=${my_months[month].toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            console.log('data',data)  
            fetch(`/api/get_orders_master_month?nikname=${nikname}&month=${my_months[month]}`)
            .then(res => res.json())
            .then(res => {
                let m = res.map(i=>i.date_order.split(','))
               
                let new_schedule = [...data]
                
                if(m.length>0){
                    m.forEach(i=> new_schedule[+i[0]-1] = new_schedule[+i[0]-1].split(',').filter(a=>a!==i[2]).join(','))
                }
                setSchedule(new_schedule)
                // setOrders(m)
                
            })
        })    
    },[month])


    // function Next(a) {
    //     // const mon = d.getMonth()
    //     // console.log(months[mon+1])
    //     // if (months[month] === months[mon+1] && a === -1) {return 0} 
    //     if (month_one === 0 && a === 1) {
    //         set_month_one(1)
    //     } else if (month_one === 1 && a === 1) {
    //         set_month_one(0)
    //         setMonth(month + a)
    //         // let fls = false_date.filter(i=>i[1] === months[month + a]).map(i=>+i[0])
    //         // set_false_days(fls)

    //     } else if (month_one === 0 && a === -1) {
    //         set_month_one(1)
    //         setMonth(month + a)
    //         // let fls = false_date.filter(i=>i[1] === months[month + a]).map(i=>+i[0])
    //         // set_false_days(fls)

    //     } else if (month_one === 1 && a === -1) {
    //         set_month_one(0)
    //     }
    // }
    useEffect(() => {
        // setMonth(mon + 1)
        const SaveOrder = async () => {
            const data = {
                client: profile.nikname,
                client_name: profile.name,
                master: nikname,
                master_name: name,
                price: price,
                order: order,
                date: `${active_day},${my_months[month]},${active_time}`,
            }
            await fetch('/api/save_order', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })            
            setSaved(false)
            setgoodorder(true)

        }
        if (active_day && active_time) {
            SaveOrder()
            setSaved(true)
        } else {
            // GetDate()
        }
    }, [order])
    function Count(a) {
        if (schedule[a-1]) {
            let l = schedule[a-1].split(',').length
            return l
        }
        return 0
    }
    function Set_Active_Day(a,b) {
        if (false_days.includes(a) || b === 0 ) {
            return
        } else {
            setActive_Day(a)
            setActive_Time()
            // let flsT = false_date.filter(i => i[1] === months[month]).filter(i => +i[0] === a).map(i => +i[2])
            // set_false_time(flsT)
            // console.log(flsT)
        }
    }
    function Set_Active_Time(a) {
        if (schedule[active_day-1]?.split(',').includes(a)) {
            setActive_Time(a)
        } else {
            return
        }
        console.log(active_time)
    }
    function SetMonth(a) {
        let m = my_months.findIndex(i => i === a)
        setMonth(m)
    }
    return (
        <>
            <div className={styles.head}>
                <span onClick={() => close(true)} />
                <span>Запись к мастеру</span>
            </div>
            <h3 className={styles.date}>Ближайшие даты</h3>
            <div className={styles.mounth}>
                {months.splice(month ? month - 1 : 0, 3).map(i =>
                    <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                )}
            </div>
            <div className={styles.week}>
                {days.map(i => <span key={i}>{i}</span>)}
            </div>
            <div className={styles.all_days}>
               
                <div className={styles.days}>
                {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                    {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                        .map(i =>
                            <span
                                onClick={() => Set_Active_Day(i, Count(i))}
                                key={i}
                                style={active_day  === i ? active : ( Count(i) === 0 ? false_day : null)}

                            >{i}
                             <b
                                className={styles.count}
                                style={{display: Count(i) ? 'inline-block' : 'none' }}
                            >{Count(i)}</b>

                            </span>
                        )}
                </div>
               
            </div>
            <h3 className={styles.date}>Свободное время</h3>
            <div className={styles.time}>
                {patern?.map(i =>
                    <span
                        onClick={() => Set_Active_Time(i)}
                        key={i}
                        style={active_time === i ? active  : schedule[active_day-1]?.split(',').includes(i) ? null  : (false_times.includes(i) ? 
                            false_day : { backgroundColor: '#fff' , border: '1px solid #d0d0d0'})}
                    >
                    {i}
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