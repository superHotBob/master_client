import Header from '@/components/header'
import { useEffect, useState } from 'react'
import styles from './recording.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { setmaster, setorder } from '@/reduser'
import Link from 'next/link'
import SelectDate from '@/components/selectdate'

export function Bov() {
    return (
        <h6>Нажмая на кнопку, вы соглашаетесь с <br />
            <Link href="/#">Условиями обработки персональных данных</Link> и <br />
            <Link href="/#">Пользовательским соглашением</Link>
        </h6>

    )
}

export default function Recording() {

    const router = useRouter()
    const dispatch = useDispatch()
    const master = useSelector(state => state.counter.master)
    const { name, nikname } = router.query
    const [view, setView] = useState(true)
    const [services, setServices] = useState()
    const [filterServices, setFilterServices] = useState()
    const [category, addCategory] = useState()
    const [active_category, set_Active_Category] = useState()
    const [orders, addOrder] = useState([])
    const [count, setCount] = useState([])




    useEffect(() => {
        if (master.phone === null) {
            router.push('/')
        }
        if (!router.query.nikname) { return; }
        async function GetServices() {
            const response = await fetch(`/api/master_service?nikname=${router.query.nikname}`)
            const result = await response.json()
            let new_cat = Object.entries(result[0])
            setServices(new_cat.filter(i => i[1].length))
            let all_category = new_cat.map(i => i[1] && i[1].length > 0 ? i[0] : null)
            addCategory(all_category.filter(i => i ? 1 : 0))
        }
        GetServices()
    }, [router.query, nikname, master])

    function SetActiveCategory(a) {
        set_Active_Category(a)
        let new_services = services.filter(i => i[0] === a)[0][1]
        setFilterServices(new_services)
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

    function World(a) {
        if (a > 1 && a < 5) {
            return 'услуги'
        } else if (a === 1) {
            return 'услуга'
        } else {
            return 'услуг'
        }
    }
    function ConfirmOrder(a) {
        dispatch(setorder(a))
        router.push('/confirmation')
    }

    return (
        <main className={styles.main}>
            <Header text="Запись к мастеру" sel={"/" + nikname} select={setView} view_time={!view} />
            {view ? <>
                <div className={styles.category}>
                    <div className={styles.all_cat}>
                        {category?.map(i =>
                            <span key={i}
                                onClick={() => SetActiveCategory(i)}
                                style={active_category === i ?
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
                    price={Cost(orders)}
                />
            }
            <div className={styles.order}>
                <h4>Ваш заказ
                    {orders.length ? <span className={styles.world_for_count}>{orders.length} {World(orders.length)}</span> : null}
                </h4>
                <p>Услуги и товары ({orders.length})<span>{Cost(orders)} BYN</span></p>

                {/* <Link href="/#" title="Скидка 10% от заказа">Скидка</Link> */}
                <h3>Общая стоимость<span>{Cost(orders)} BYN</span></h3>
                {view ?
                    <div onClick={() => setView(orders.length > 0 ? false : true)}>Выбрать дату</div>
                    :
                    <div onClick={() => ConfirmOrder([...orders])}>Записаться</div>
                }
                <Bov />

            </div>

        </main>
    )
}