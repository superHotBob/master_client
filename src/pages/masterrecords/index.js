import Header from '@/components/header'
import styles from './records.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setorder } from '@/reduser'

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
const orders = [
    {active: 1,client: 'Вика', nikname:'Mercedec',cost: 4500, date: '17 Сентября в 17: 00',order: 4588, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
    {active: 0,client: 'Клава ', nikname:'RedBull',cost: 2500, date: '17 Сентября в 17: 00',order: 4587, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
    {active: 0,client: 'Эмануил', nikname:'Super1245',cost: 5800, date: '17 Сентября в 17: 00',order: 4589, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'}
]
const records = [
    { date: 1679156076446, orders: [2345, 2478, 2588] },
    { date: 1679156176446, orders: [2375] },
    { date: 1679156276446, orders: [2558] },
]

export default function Records() {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "суб"]
    const months = [ 'декабрь','январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сетнябрь',
        'октябрь', 'ноябрь','декабрь']
    const my_months = [...months]    
    const false_days = [10, 16, 30]

    const d = new Date()
    const mon = d.getMonth()+ 1
   
    const [month, setMonth] = useState(mon)
    
    const all_days = new Date(2023, month, 0)
    

    const dispatch = useDispatch()
    const router = useRouter()
    const [selector, setSelector] = useState(1)
    const [active_day, setActive_Day] = useState()

    function viewOrder(a,b) {
        dispatch(setorder(orders[a]))
        router.push('/order/' + b)
    }
    function MyDate(a) {
        const day = new Date(2023, month, a)
        return a + ' ' + days[day.getDay()]
    }

    function SetMonth(a) {
        let m = my_months.findIndex(i=>i===a)
        console.log(m)
        setMonth(m)
       
    }

    return (
        <main className={styles.main}>
            <Header sel="/" text="Записи на сеанс" />
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Записи на сеанс</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>История записей</span>
            </div>
            {selector ?
                <section className={styles.section}>
                    <div className={styles.mounth}>
                        {months.splice(month ? month-1 : 0 ,3).map((i, index) =>
                            <span onClick={() => SetMonth(i)} style={i === my_months[month] ? activ_month : null} key={i}>{i}</span>
                        )}
                    </div>
                    <div className={styles.days}>
                        {Array.from({ length: all_days.getDate() }, (v, i) => i + 1)
                            .map(i =>
                                <span
                                    onClick={() => setActive_Day(i)}
                                    key={i}
                                    style={!false_days.includes(i) ? false_mo : active_day === i ? active : null}
                                >{MyDate(i)}</span>
                            )}

                    </div>
                    <p>Все записи на сеансы</p>
                    <button>
                        <span>
                            Добавить запись
                        </span>
                    </button>
                    {orders.map((i,index)=>
                        <div 
                            onClick={()=>viewOrder(index,i.order)}
                            key={i.order} 
                            className={styles.order}    
                        >
                            <p><span className={i.active?styles.active:null}>{i.date}</span><span>#{i.order}</span></p>
                            <h3><span>{i.client}</span><span>{i.cost} ₽</span></h3>
                            <h6>{i.text}</h6>
                        </div>
                    )}
                </section> :
                <section className={styles.section}>
                    {orders.map((i,index)=>
                        <div 
                            onClick={()=>viewOrder(index,i.order)}
                            key={i.order} 
                            className={styles.order}    
                        >
                            <p><span>{i.date}</span><span>#{i.order}</span></p>
                            <h3><span>{i.client}</span><span>{i.cost} ₽</span></h3>
                            <h6>{i.text}</h6>
                        </div>
                    )}
                </section> }
        </main>
    )
}