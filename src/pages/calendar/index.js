import Header from '@/components/header'
import styles from './calendar.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Message from '@/components/message'

const activ_month = {
    color: '#282828',
}



export default function Calendar() {

   
    const patern = ['10:00','12:00','14:00']

    const mnt_may = [
    "10:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "14:00",
    "10:00,12:00,14:00",
    "14:00",
    "",
    "",
    "10:00,12:00",
    "",
    "12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00",
    "10:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00",
    "",
    "10:00,14:00",
    "10:00,12:00,14:00",
    "10:00,12:00,14:00",
    "12:00,14:00",
    "10:00,14:00",
    ""]

    const days = ["пн", "вт", "ср", "чт", "пт", "суб", "вс"]
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
        'Октябрь', 'Ноябрь', 'Декабрь']
       
    const d = new Date()
    const mon = d.getMonth() + 1
    const [month, setMonth] = useState(mon)
    const my_months = [...months]
    const [active_day, setActive_Day] = useState()
    const [active_num, setActive_Num] = useState()
    const all_days = new Date(2023, month, 0)
    const [mnt, setMnt] = useState()

    const [profile, setProfile] = useState([])

    const day = new Date(2023, month - 1, 1)
    const day_b = new Date(2023, month + 3, 1)
    let v = days.indexOf(days[day.getDay() - 1])
    


    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro.color)
        setMnt(mnt_may)
    }, [])
    function SetActiveDay(a) {
        setActive_Day(mnt[a-1])
        setActive_Num(a)
        console.log(mnt[a-1])
    }
    function SetActiveTime(a) {
        let act_day = mnt[active_num-1]
        console.log('Active day',act_day,"Active time", a)
       
      
        if(!act_day) {
            act_day = a 
            mnt[active_num-1] = act_day
            setActive_Day(a)
            return setMnt([...mnt])
           
        }
        if(act_day.split(',').some(i=>i===a)) {
            let t= act_day.split(',').filter(i=>i!==a).join()
            mnt[active_num-1] = t
            setActive_Day(t)
            return setMnt([...mnt])
           

        } else {
            let t = act_day + ',' + a
            mnt[active_num-1] = t
            setActive_Day(t)
            return setMnt([...mnt])

        }
       

    }

    function Count(a) {
        if( mnt[a]) {
            let l = mnt[a].split(',').length
            return l
        }
        return 0
       
    }
    function SetMonth(a) {
        let m = my_months.findIndex(i => i === a)
        setMonth(m)
    }
   
    return <>
        <Header sel="/" text="Календарь работы" color={profile} />
        <section className={styles.section}>
            <Message text={`Выбирайте дни и время, вы которые вы готовы
                        принимать клиентов. При записи елиен  сможет
                        выбрать только те дни и время, которые 
                        вы указали рабочим.
                    `} color={profile}
            />
            <div className={styles.mounth}>
                {months.splice(month ? month - 1 : 0, 3).map((i, index) =>
                    <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                )}
            </div>
            <div className={styles.week}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(i => <span key={i}>{i}</span>)}
            </div>

            <div className={styles.days}>
                {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                {mnt?<>
                {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                    .map((i,index) =>
                        <span
                            onClick={() => SetActiveDay(i)}
                            key={i}
                            id = {i}
                            style={active_num == i ? {backgroundColor: profile[1],color: '#fff'} : {backgroundColor: profile[2],color: profile[1]}}
                        >{i}
                        <b 
                            className={styles.count}
                            style={{backgroundColor: profile[1],color: profile[2],display: Count(index)?'inline-block':'none'}}
                        >{Count(index)}</b>
                        
                        </span>
                    )}</>: null}
            </div>
            <p>Время для записи</p>
            <div className={styles.time}>
                {patern.map((i) =>
                    <span 
                        key={i} 
                        style={active_day?.split(',').some(a=> a === i ) ? 
                        { backgroundColor: profile[1] } : 
                        { backgroundColor: profile[2],color: profile[1] }}
                        onClick={()=>SetActiveTime(i)}
                    >
                        {i}
                    </span>
                )}
            </div>
            <button style={{ backgroundColor: profile[2] }}>
                <span style={{ color: profile[1] }}>
                    Редактировать шаблон времени +
                </span>
            </button>
        </section>
        <div>

        </div>

    </>
   
}