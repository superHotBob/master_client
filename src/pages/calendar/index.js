import Header from '@/components/header'
import styles from './calendar.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Message from '@/components/message'
import EditPatern from '@/components/editpatern'
import Menu_icon from '@/components/icons/menu'

const activ_month = {
    color: '#282828',
}



export default function Calendar() {

    const new_patern = ['10:00', '12:00', '14:00']

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
    const [active_day, setActive_Day] = useState(null)
    const [active_num, setActive_Num] = useState()
    const all_days = new Date(2023, month, 0)
    const [mnt, setMnt] = useState()
    const [patern, setPatern] = useState([])
    const [view, setView] = useState(false)

    const [profile, setProfile] = useState([])
    const year = new Date().getFullYear()
    const day = new Date(year, month - 1, 1)
    // const day_b = new Date(2023, month + 3, 1)
    let v = days.indexOf(days[day.getDay() - 1])

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro.color)
        fetch(`/api/get_patern?nikname=client5143`)
        .then(res => res.json())
        .then(res => {
            setPatern(res)
            console.log(res)
        })
    }, [])
    useEffect(() => {
        let new_arr = Array.from({ length: all_days.getDate() }, (v, i) => '')
        setMnt(new_arr)
        setActive_Day()
        setActive_Num()
    }, [month])

    function SaveSchedule() {
        console.log(mnt)
        const data = {
            nikname: 'client5143',
            month: 'май',
            schedule: mnt
        }
        fetch('/api/edit_schedule', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
    }
    function SetActiveDay(a) {
        setActive_Day(mnt[a - 1])
        setActive_Num(a)
        console.log(mnt[a - 1])
    }
    function SetActiveTime(a) {
        let act_day = mnt[active_num - 1]
        if (!act_day) {
            act_day = a
            mnt[active_num - 1] = act_day
            setActive_Day(a)
            return setMnt([...mnt])
        }
        if (act_day.split(',').some(i => i === a)) {
            let t = act_day.split(',').filter(i => i !== a).join()
            mnt[active_num - 1] = t
            setActive_Day(t)
            return setMnt([...mnt])
        } else {
            let t = act_day + ',' + a
            mnt[active_num - 1] = t
            setActive_Day(t)
            return setMnt([...mnt])
        }
    }

    function Count(a) {
        if (mnt[a]) {
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
        {profile ? 
        <header className={styles.header}>
            <Menu_icon type="arrow_button" color={profile[1]}  />
            <h4>Календарь работы</h4>
            <span onClick={SaveSchedule} style={{ color: profile[1] }}>Сохранить</span>
        </header>:null}
        <section className={styles.section}>
            <Message text={`Выбирайте дни и время, вы которые вы готовы
                        принимать клиентов. При записи елиен  сможет
                        выбрать только те дни и время, которые 
                        вы указали рабочим.
                    `} color={profile}
            />
            <div className={styles.mounth}>
                {months.splice(month ? month - 1 : 0, 3).map(i =>
                    <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                )}
            </div>
            <div className={styles.week}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(i => <span key={i}>{i}</span>)}
            </div>

            <div className={styles.days}>
                {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}
                {mnt ? <>
                    {Array.from({ length: all_days.getDate() }, (v, i) => i+1)
                        .map((i, index) =>
                            <span
                                onClick={() => SetActiveDay(i)}
                                key={i}
                                id={i}
                                style={active_num == i ? { backgroundColor: profile[1], color: '#fff' } : { backgroundColor: profile[2], color: profile[1] }}
                            >{i}
                                <b
                                    className={styles.count}
                                    style={{ backgroundColor: profile[1], color: profile[2], display: Count(index) ? 'inline-block' : 'none' }}
                                >{Count(index)}</b>

                            </span>
                        )}</> : null}
            </div>
            <p>Время для записи</p>
            <div className={styles.time}>
                {patern?.map((i) =>
                    <span
                        key={i}
                        style={active_day?.split(',').some(a => a === i) ?
                            { backgroundColor: profile[1] } :
                            { backgroundColor: profile[2], color: profile[1] }}
                        onClick={() => SetActiveTime(i)}
                    >
                        {i}
                    </span>
                )}
            </div>
            <button style={{ backgroundColor: profile[2] }} onClick={() => setView(true)}>
                <span style={{ color: profile[1] }}>
                    Редактировать шаблон времени +
                </span>
            </button>
            
        </section>
        {view ? <EditPatern view={view} setView={setView} color={profile} old_patern={patern} /> : null}
        <div>

        </div>

    </>

}