import Header from '@/components/header'
import styles from './records.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setorder } from '@/reduser'
import Navi from '@/components/navi'

const activ_month = {
    width: '55%',
    color: '#282828',
}
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}
const active = {
    backgroundColor: '#8B95F2',
}
const false_mo = {
    backgroundColor: '#fff',
    color: '#d0d0d0',
    border: '1px solid #d0d0d0'
}

const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]





export default function Records() {
    
    const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август','Сетнябрь','Октябрь', 'Ноябрь', 'Декабрь']
    const my_months = [...months]
   
  

    const d = new Date()
    const mon = d.getMonth() + 1

    const [month, setMonth] = useState(mon)

    const all_days = new Date(2023, month, 0)


    const dispatch = useDispatch()
    const router = useRouter()
    const [selector, setSelector] = useState(1)
    const [active_day, setActive_Day] = useState()
    const [false_days, set_false_days] = useState([])
    const [first_orders, set_first_order] = useState([])
    const [orders, setOrders] = useState()
    const [profile, setProfile] = useState()

    async function GetMasterOrders(a) {
        const response = await fetch(`/api/get_orders_master?nikname=${a.nikname}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'get',
            })
            const result = await response.json() 
            const new_result = [...result]
            set_first_order(result)
            let month_result = new_result.filter(i=>i.date_order.includes(months[month]))
            let flsd = month_result.map(i=>+i.date_order.split(',')[0])            
            set_false_days(flsd)
            setOrders(month_result)              
           
    }  
   
    function FilterDay(a){
        setActive_Day(a)       
        let result = first_orders.filter(i => +i.date_order.split(',')[0] === a)       
        setOrders(result) 
    }
   
    function MyDate(a) {
        const day = new Date(2023, month, a)
        return a + ' ' + days[day.getDay()]
    }
    function Count(a) {
        let s = false_days.filter(i=>i===a).length
        return s
    }
    function SetMonth(a) {        
        let m = my_months.findIndex(i => i === a)
        setMonth(m)
        let month_result = first_orders.filter(i=>i.date_order.includes(a))
        setOrders(month_result)          
        let flsd = month_result.map(i=>+i.date_order.split(',')[0])            
        set_false_days(flsd)
    }
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
        GetMasterOrders(pro)
    }, [])

    return (
        <main className={styles.main}>
            {profile ? <>
                <Header sel="/" text="Записи на сеанс" color={profile.color} />
                <div className={styles.selector}>
                    <span
                        onClick={() => setSelector(1)}
                        style={selector ? { backgroundColor: profile.color[1], color: '#fff', fontWeight: 600 } : null}
                    >Записи на сеанс</span>
                    <span
                        onClick={() => setSelector(0)}
                        style={selector ? null : { backgroundColor: profile.color[1], color: '#fff', fontWeight: 600 }}
                    >История записей</span>
                </div>
                {selector ?
                    <section className={styles.section}>
                        <div className={styles.mounth}>
                            {months.splice(month ? month - 1 : 0, 3).map((i, index) =>
                                <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                            )}
                        </div>
                        <div className={styles.days}>
                            {Array.from({ length: all_days.getDate() }, (v,i) => i + 1)
                                .map(i =>
                                    <span
                                        onClick={() => FilterDay(i)}
                                        key={i}
                                        style={!false_days.includes(i) ? false_mo : active_day === i ? { backgroundColor: profile.color[2], color: profile.color[1], fontWeight: 600 } : { backgroundColor: profile.color[1], color: '#fff', fontWeight: 600 }}
                                    >
                                    {MyDate(i)}
                                    {Count(i)>0 ? <b style={{background: profile.color[2],color: profile.color[1]}} className={styles.count}>{Count(i)}</b>:null}
                                    </span>
                                )}

                        </div>
                        <p>Все записи на сеансы</p>
                        <button style={{ backgroundColor: profile.color[1] }}>
                            Добавить запись <span>+</span>
                        </button>
                        {orders?.map(i =>
                            <div
                                onClick={() => viewOrder(i.id)}
                                key={i.order}
                                className={styles.order}
                            >
                                <p><span className={i.active ? styles.active : null}>{i.date_order.replace(/,/g, ' ')}:00</span><span>#{i.id}</span></p>
                                <h3>
                                    <span style={{ color: profile.color[1] }}>{i.client}</span>
                                    <span style={{ color: profile.color[1] }}>{i.price} BYN</span>
                                </h3>
                                <h6 style={{ color: profile.color[1] }}>{i.neworder.replace(/[0-9]/g,' ').replace(/:/g,' ')}</h6>
                            </div>
                        )}
                        
                    </section> :
                    <section className={styles.section}>
                        {first_orders.map(i =>
                            <div
                                onClick={() =>  router.push('/order/' + b)}
                                key={i.order}
                                className={styles.order}
                            >
                               <p><span className={i.active ? styles.active : null}>{i.date_order.replace(/,/g, ' ')}:00</span><span>#{i.id}</span></p>
                                <h3 ><span style={{ color: profile.color[1] }}>{i.client}</span><span style={{ color: profile.color[1] }}>{i.price} BYN</span></h3>
                                <h6 style={{ color: profile.color[1] }}>{i.neworder.replace(/[0-9]/g,'  ').replace(/:/g,' ')}</h6>
                            </div>
                        )}
                   
                    </section>}
                    <Navi color={profile.color[1]} />        
            </> : null}
           
        </main>
    )
}