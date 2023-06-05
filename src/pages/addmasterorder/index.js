import styles from './addmasterorder.module.css'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useEffect, useState , useRef} from 'react'
import arrow from '../../../public/arrow_back.svg'
import { useRouter } from 'next/router'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)

const active = {
    backgroundColor: '#3D4EEA',
    color: '#fff',
    borderRadius: '4px'
}
const months = ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь',
'Октябрь', 'Ноябрь']
export default function AddMasterOrder() {
    const ref = useRef()
    const profile = useSelector(state => state.counter.profile)
    const router = useRouter()
    const [date, handleDateChange] = useState(new Date());
    const [category, setcategory] = useState()
    const [active_category, set_Active_Category] = useState()
    const [services, setServices] = useState()
    const [orders, setOrders] = useState([])
    const [countCategory, setCountCategory] = useState([])


    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem('profile'))       
        if (pro.status === 'master') {
            setcategory(pro.services)
            async function GetServices() {
                const response = await fetch(`/api/master_service?nikname=${profile.nikname}`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'get',
                })
                const result = await response.json()
                setServices(result[0])
                
            }
            GetServices()
        } else {
            router.push('/')
        }
    }, [])
    async function RecordingOrder() {
        const data = {
            text: ref.current.value,
            date: `${date.getDate()},${months[date.getMonth()+1]},${date.getHours()}`,
            master: profile.nikname,
            master_name: profile.name,
            client: 'guest',
            client_name: 'guest',
            order: orders,
            price: Cost(0)
        }       
         const response = await fetch('/api/save_order', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
            const result = await response.json()
           
               
    }
    
    function Cost(a) {
        if (a.length === 0) {
            return 0
        } else {
            let cost = orders.map(i => +i.split(':')[1])
            let sum = cost.reduce((i, a) => a + i)
            return sum
        }
    }
    function CountCategory(a) {
        return 0
    }
    function FilterServices() {
        if (active_category) {
            let new_array = []
            new_array.push(services[active_category])
            return new_array
        } else {
            return []
        }
    }
    function Width() {
        if (category.length > 4) {
            return '25%'
        } else {
            let wh = Math.trunc(100 / category.length) + '%'
            return wh
        }
    }
    function AddOrder(a) {
        console.log(a)
        if (orders.includes(a[0])) {
            let new_order = orders.filter(i => i !== a[0])
            setOrders(new_order)
        } else {
            setOrders(orders => ([...orders, a[0]]))
        }

        console.log(orders)

    }
    return (
        <main>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <span>Добавить запись</span>
                <span>Закрыть</span>
            </header>
            <section className={styles.main}>             
                <p>Дата и время</p>
                <span>Выберите дату записи и время.</span>
                <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={60}

                    dateFormat="Pp"
                    locale="ru"

                />
                <p>Услуги и стоимость</p>
                <span>Выберите предоставляемые услуги клиенту. Вы можете<br />
                    скоректировать стоимость индивидуально для заказа.
                </span>
            </section>
            <div className={styles.category}>
                <div className={styles.all_cat}>
                    {category?.map(i =>
                        <span key={i}
                            onClick={() => set_Active_Category(i)}
                            style={active_category === i ?
                                {
                                    color: '#fff',
                                    fontWeight: 500,
                                    display: 'inline-block',
                                    width: Width(),
                                    backgroundColor: '#3D4EEA',
                                } : { width: Width() }}
                        >
                            {i}
                            <b
                                className={active_category == i ? styles.active_count : null}
                                style={{ display: CountCategory(i) === 0 ? 'none' : 'inline-block' }}
                            >{CountCategory(i)}</b>
                        </span>
                    )}
                </div>
            </div>
            <section>
                {FilterServices()?.map((i, index) =>
                    <div key={index}
                        className={orders?.includes(i[0]) ? styles.active_service : styles.service}
                        onClick={() => AddOrder(i)}
                    >
                        {i[0].split(':').map((a, index) => <span key={index}>{a}{' '}{index ? 'BYN' : ""}</span>)}
                    </div>
                )}
            </section>
            <section className={styles.main}>
            <h4>Дополнительное описание</h4>
            <span>Вы можете дополнительно описать индивидуальный заказ для клиента.</span>
            <textarea placeholder='Опишите услугу' ref={ref} />
            </section>
            <div className={styles.order}>
                <h3>Общая стоимость<span>{Cost(orders)} {profile.currency}</span></h3>
                <div onClick={RecordingOrder}>Записать</div>
            </div>

        </main>
    )
}