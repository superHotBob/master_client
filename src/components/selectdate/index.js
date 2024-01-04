import styles from './selectdate.module.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setdate } from '@/reduser'
import { months } from '@/profile'

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

export default function SelectDate({ nikname, order }) {
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const dispatch = useDispatch()
    const d = new Date()
    const mon = d.getMonth() + 1
    const [month, setMonth] = useState(mon)
    const my_months = [...months]
   
    const [false_days, set_false_days] = useState([])
    const [active_day, setActive_Day] = useState()
    const [active_time, setActive_Time] = useState()





    const [curmonth, setcurmonth] = useState(d.getMonth() + 1)
    const [year, setyear] = useState(new Date().getFullYear())





    const [patern, setPatern] = useState([])
    const [schedule, setSchedule] = useState([])


    const all_days = new Date(2023, month, 0)
    const profile = useSelector(state => state.counter.profile)

    const day = new Date(year, curmonth - 1, 1)
    let v = days.indexOf(days[day.getDay() - 1]) === -1 ? 6 : days.indexOf(days[day.getDay() - 1])

  

    useEffect(() => {
        setSchedule()
        let day = d.getDate()

        if (month > mon) {
            set_false_days([])
        } else {
            let all_day = Array.from({ length: day }, (v, i) => i + 1)
            set_false_days(all_day)
        }

        fetch(`/api/get_schedule?nikname=${nikname}&month=${my_months[curmonth]}&year=${year}`)
            .then(res => res.json())
            .then(data => setSchedule([...data])
            )
    }, [curmonth])


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

    function Count(a) {
        return a ? a.split(',').filter(i => i).length : null
    }
    function Set_Active_Day(a, b, index) {
        if (!b) {
            return;
        } else {
            setActive_Day(index + 1)
            setActive_Time()
            setPatern(schedule[index].split(',').sort())
            // let flsT = false_date.filter(i => i[1] === months[month]).filter(i => +i[0] === a).map(i => +i[2])
            // set_false_time(flsT)
            // console.log(flsT)
        }
    }
    function Set_Active_Time(a) {
        const dt = new Date()       
        dispatch(setdate(`${active_day},${my_months[curmonth]},${a},${year}`))
        setActive_Time(a)
        const tm = a.split(':')
        const date_ord = new Date(dt.getFullYear(), curmonth, active_day, tm[0], tm[1]);
       
       



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
        setSchedule([])
        setActive_Day()
        setActive_Time()
        setPatern([])
    }
    function SetMonth(a) {
        setSchedule([])
        setActive_Day()
        setActive_Time()
        if (a === 'Январь') {
            setMonth(12)
        } else {
            let m = my_months.findIndex(i => i === a)
            setMonth(m)
        }
        setPatern([])
    }
    const disabled_day = a => Date.parse(new Date(year, curmonth - 1, a + 1)) <= Date.parse(new Date())
    const disabled_time = a => Date.parse(new Date(year, curmonth - 1, active_day, a)) <= Date.parse(new Date())

    return (
        <>
            <h3 className={styles.date}>Ближайшие даты </h3>
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
            <div className={styles.all_days}>
                <div className={styles.days}>
                    {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                    {schedule?.map((i, index) =>
                        <button
                            onClick={() => Set_Active_Day(i, Count(i), index)}
                            key={index}
                            style={active_day === index + 1 ? (Count(i) === 0 ? false_day : active) : null}
                            disabled={disabled_day(index + 1)}
                        >{index + 1}
                            <b
                                className={styles.count}
                                style={{
                                    display: Count(i) ? 'inline-block' : 'none',
                                    backgroundColor: !Count(i) ? null : active_day === index + 1 ? '#8B95F2' : '#3D4EEA'
                                }}
                            >{Count(i)}</b>
                        </button>
                    )}

                </div>

            </div>
            <h3 className={styles.date}>Свободное время {!schedule?.length ? 'отсувствует' : ''}</h3>
            <div className={styles.time}>
                {patern?.filter(i => i).map(i =>
                    <button
                        onClick={() => Set_Active_Time(i)}
                        key={i}
                        disabled={disabled_time(i)}
                        style={active_time === i ? active : { backgroundColor: '#fff', border: '1px solid #d0d0d0' }}
                    >
                        {i}
                    </button>
                )}
            </div>


        </>
    )
}