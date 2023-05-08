import Header from '@/components/header'
import styles from './calendar.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Message from '@/components/message'
import EditPatern from '@/components/editpatern'
import Menu_icon from '@/components/icons/menu'

const activ_month = {
    color: '#282828',
}



export default function Calendar() {

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
    const [mnt, setMnt] = useState([])
    const [patern, setPatern] = useState([])
    const [view, setView] = useState(false)
    const [message, setMessage] = useState(false)
    const [profile, setProfile] = useState()
    const year = new Date().getFullYear()
    const day = new Date(year, month - 1, 1)
    let v = days.indexOf(days[day.getDay() - 1])
    const router = useRouter()
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem('profile'))
        if (!pro) {
            return  () => router.push('/enter')
        }
        setProfile(pro)
        fetch(`/api/get_patern?nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(data => setPatern(data))

    }, [view])
    useEffect(() => {
        let current_month = my_months[month].toLocaleLowerCase()
        let pro = JSON.parse(localStorage.getItem("profile"))
        if (!pro) {
            return  () => router.push('/enter')
        }
        setActive_Day()
        setActive_Num()
        fetch(`/api/get_schedule?month=${current_month}&nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(res => {
                if (res.length === 0) {
                    let new_arr = Array.from({ length: all_days.getDate() }, (v, i) => '')
                    setMnt(new_arr)
                } else {
                    setMnt(res)
                }

            })

    }, [month])

    function SaveSchedule() {
        let pro = JSON.parse(localStorage.getItem("profile"))
        const data = {
            nikname: pro.nikname,
            month: my_months[month].toLocaleLowerCase(),
            schedule: mnt
        }
        fetch('/api/edit_schedule', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res => {
            setMessage(true)
            setTimeout(() => setMessage(false), 3000)
        })

    }
    function SetActiveDay(a) {
        setActive_Day(mnt[a - 1])
        setActive_Num(a)
    }
    function SetActiveTime(a) {
        if (!active_num) { return 0 }


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
            <header className={styles.header} style={{ color: profile.color[1] }}>
                <Menu_icon type="arrow" color={profile.color[1]} />
                <h4>Календарь работы</h4>
                <span onClick={SaveSchedule}>Сохранить</span>
            </header> : 
        null}
        <section className={styles.section}>
            <Message text={`Выбирайте дни и время, вы которые вы готовы
                        принимать клиентов. При записи клиент  сможет
                        выбрать только те дни и время, которые 
                        вы указали рабочим.
                    `} color={profile?.color}
            />
            <div className={styles.mounth}>
                {months.splice(month ? month - 1 : 0, 3).map(i =>
                    <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                )}
            </div>
            <div className={styles.week}>
                {days.map(i => <span key={i}>{i}</span>)}
            </div>
            <dialog open={message} className={styles.message}>
                Календарь  сохранен
            </dialog>
            <div className={styles.days}>
                {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}

                {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                    .map((i, index) =>
                        <span
                            onClick={() => SetActiveDay(i)}
                            key={i}
                            id={i}
                            style={active_num == i ? { backgroundColor: profile?.color[1], color: '#fff' } : { backgroundColor: profile?.color[2], color: profile?.color[1] }}
                        >{i}
                            <b
                                className={styles.count}
                                style={{ backgroundColor: profile?.color[1], color: profile?.color[2], display: Count(index) ? 'inline-block' : 'none' }}
                            >{Count(index)}</b>

                        </span>
                    )}
            </div>
            <p>Время для записи</p>
            <div className={styles.time}>
                {patern?.map((i) =>
                    <span
                        key={i}
                        style={active_day?.split(',').some(a => a === i) ?
                            { backgroundColor: profile.color[1] } :
                            { backgroundColor: profile.color[2], color: profile.color[1] }}
                        onClick={() => SetActiveTime(i)}
                    >
                        {i}
                    </span>
                )}
            </div>
            <div className={styles.button} style={{ backgroundColor: profile?.color[2], color: profile?.color[1] }} onClick={() => setView(true)}>
                Редактировать шаблон времени +
            </div>
        </section>
        {view ?
            <EditPatern
                view={view}
                setView={setView}
                color={profile.color}
                old_patern={patern}
                nikname={profile.nikname}
            /> : null
        }
       

    </>

}