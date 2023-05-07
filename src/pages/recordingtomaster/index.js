import Header from '@/components/header'
import { useEffect, useState } from 'react'
import styles from './recording.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SelectDate from '@/components/selectdate'

const active = {
    backgroundColor: '#3D4EEA',
    color: '#fff',
    borderRadius: '4px'
}

export default function Recording() {

    const router = useRouter()
    const { name, nikname } = router.query
    const [view, setView] = useState(true)
    const [services, setServices] = useState()
    const [filterServices, setFilterServices] = useState()
    const [category, addCategory] = useState()
    const [active_category, set_Active_Category] = useState()
    const [orders, addOrder] = useState([])
    const [count, setCount] = useState([])


    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString)
        async function GetServices() {
            const response = await fetch(`/api/master_service?nikname=${urlParams.get('nikname')}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'get',
            })
            const result = await response.json()
            let new_serv = Object.values(result[0])
            let new_cat = Object.entries(result[0])
            setServices(new_cat.filter(i => i[1] ? (i[1].length > 0 ? 1 : 0) : 0))
            let all_category = new_cat.map(i => i[1] && i[1].length > 0 ? i[0] : null)
            addCategory(all_category.filter(i => i ? 1 : 0))
        }
        if (services) {
            let new_services = services.filter(i => i[0] === active_category)[0][1]
            setFilterServices(new_services)
        } else {
            GetServices()
        }
    }, [active_category])

    function Cost(a) {
        if (a.length === 0) {
            return 0
        } else {
            let cost = orders.map(i => +i.split(':')[1])
            let sum = cost.reduce((i, a) => a + i)
            return sum
        }
    }

    function AddOrder(a) {
        if (orders.includes(a)) {
            let ord = orders.filter(i => i == a ? 0 : 1)
            addOrder(ord)
            let ind = count.indexOf(active_category)
            count[ind] = ''
        } else {
            addOrder(orders => ([...orders, a]))
            setCount(count => ([...count, active_category]))
        }
    }

    function CountCategory(a) {
        return count.filter(i => i === a).length > 0 ? count.filter(i => i === a).length : ''
    }

    return (
        <main className={styles.main}>
            {view ? <>
                <Header text="Запись к мастеру" sel={"/master/" + nikname} />
                <div className={styles.category}>
                    <div className={styles.all_cat}>
                        {category?.map(i =>
                            <span key={i}
                                onClick={() => set_Active_Category(i)} style={active_category === i ?
                                    {
                                        color: '#fff',
                                        fontWeight: 500,
                                        backgroundColor: '#3D4EEA',
                                    } : null}
                            >
                                {i}
                                <b
                                    className={active_category == i ? styles.active_count : null}
                                    style={{ display: CountCategory(i) === '' ? 'none' : 'inline-block' }}
                                >
                                    {CountCategory(i)}
                                </b>
                            </span>
                        )}
                    </div>
                </div>
                {filterServices?.map((i, index) =>
                    <div key={index}
                        className={orders.includes(i) ? styles.active_service : styles.service}
                        onClick={() => AddOrder(i)}
                    >
                        {i.split(':').map((a, index) => <span key={index}>{a}{' '}{index ? 'BYN' : ""}</span>)}
                    </div>
                )}


            </>
                :
                <SelectDate
                    name={name}
                    nikname={nikname}
                    order={orders}
                    close={setView}
                    price={Cost(orders) - 50}
                />
            }
            <div className={styles.order}>
                <h4>Ваш заказ</h4>
                <p>Услуги и товары ({orders.length})<span>{Cost(orders)} BYN</span></p>
                <p>Скидка<span className={styles.discount}>-50 BYN</span></p>
                <Link href="/#">Скидка</Link>
                <h3>Общая стоимость<span>{Cost(orders) - 50 > 0 ? Cost(orders) - 50 : 0} BYN</span></h3>
                {view ?
                    <div onClick={() => setView(orders.length > 0 ? false : true)}>Выбрать дату</div> :
                    <div onClick={() => addOrder([...orders])}>Записаться</div>
                }
                <h6>Нажмая на кнопку, вы соглашаетесь с <br />
                    <Link href="/#">Условиями обработки персональных данных</Link> и <br />
                    <Link href="/#">Пользовательским соглашением</Link>
                </h6>

            </div>

        </main>
    )
}