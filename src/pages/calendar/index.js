import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
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

    const pro = useSelector(state => state.counter.profile)
    const dispatch = useDispatch()
    console.log('this is calendar block')

    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

    const d = new Date()
    const year = d.getFullYear()
    const mon = d.getMonth()

    const [month, setMonth] = useState(mon)
    const my_months = [...months]
    const [active_day, setActive_Day] = useState()
    const [active_num, setActive_Num] = useState()
    const all_days = new Date(year, month + 1, 0)

    const [mnt, setMnt] = useState([])
    const [patern, setPatern] = useState([])
    const [view, setView] = useState(false)
    const [message, setMessage] = useState(false)
    const [profile, setProfile] = useState()
    const day = new Date(year, month, 1)
    let v = days.indexOf(days[day.getDay() - 1]) === -1 ? 6 : days.indexOf(days[day.getDay() - 1])

    const router = useRouter()

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem('profile'))
        dispatch(setprofile(pro))

        if (!pro) {
            router.push('/')
            return;
        }
        // setProfile(pro)
        fetch(`/api/get_patern?nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(data => setPatern(data))
    }, [view])
    useEffect(() => {
        let current_month = my_months[month].toLocaleLowerCase()
        let pro = JSON.parse(localStorage.getItem('profile'))
        if (!pro) {
            router.push('/')
            return;
        }
        setActive_Day()
        setActive_Num()
        fetch(`/api/get_schedule?month=${current_month}&nikname=${pro.nikname}`)
            .then(res => res.json())
            .then(res => {
                if (res.length === 0) {
                    let new_arr = Array.from({ length: all_days.getDate() }, (v, i) => "")
                    console.log(new_arr)
                    setMnt(new_arr)
                } else {
                    setMnt(res)
                }
            })
    }, [month])

    function SaveSchedule() {
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

    function SetActiveTime(a) {
        if (!active_num) { return 0 }

        let act_day = mnt[active_num - 1]
        if (!act_day) {
            act_day = a
            mnt[active_num - 1] = act_day
            setActive_Day(a)
            console.log(mnt)
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
    function setActiveDay(e) {
        setActive_Day(mnt[e.target.id - 1])
        setActive_Num(e.target.id)
        console.log(e.target.id)
    }
    function SetMonth(a) {
        if (a === 'Январь') {
            setMonth(12)
        } else {
            let m = my_months.findIndex(i => i === a)
            setMonth(m)
        }
    }

    return <>
        {Object.keys(pro).length > 0 ? <>
            <header className={styles.header} >
                <Menu_icon type="arrow" color='#3D4EEA' />
                <h4>Календарь работы</h4>
                <span onClick={SaveSchedule}>Сохранить</span>
            </header>
            <section className={styles.section}>
                <Message page="calendar" text='Выбирайте дни и время, вы которые вы готовы
                        принимать клиентов. При записи клиент  сможет
                        выбрать только те дни и время, которые 
                        вы указали рабочим.
                    '
                />
                <div className={styles.mounth}>
                    {months.splice(month ? month - 1 : 0, 3).map(i =>
                        <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                    )}
                </div>
                <div className={styles.week}>
                    {days.map(i => <span key={i}>{i}</span>)}
                </div>

                <div className={styles.days} onClick={setActiveDay}>
                    {Array.from({ length: v }, (v, i) => i + 1).map(i => <span key={i} style={{ opacity: 0 }}>{i}</span>)}

                    {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                        .map((i, index) =>
                            <button

                                key={i}
                                id={i}
                                style={{ color: +active_num === i ? '#fff' : '#000', backgroundColor: +active_num === i ? "#3D4EEA" : "#ECEEFD" }}
                            >{i}
                                <b
                                    className={styles.count}
                                    style={{
                                        backgroundColor: +active_num === i ? "#8B95F2" : "#3D4EEA",
                                        display: Count(index) ? 'inline-block' : 'none'
                                    }}

                                >
                                    {Count(index)}
                                </b>
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
                {!view ? <div className={styles.button} onClick={() => setView(true)}>
                    Редактировать шаблон времени +
                </div> : null}
                <dialog open={message} className={styles.message}>
                    Календарь  сохранен
                </dialog>
            </section>
        </> : null}
        {view ?
            <EditPatern
                view={view}
                setView={setView}
                color={pro.color}
                old_patern={patern}
                nikname={pro.nikname}
            /> : null
        }


    </>

}