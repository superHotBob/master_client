import styles from './client.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ClientOrder from '@/components/orderclient'
const url = 'https://masters-client.onrender.com'
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}


const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь', 'Октябрь', 'Ноябрь', 'Декабрь']



export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { pid } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [selector, setSelector] = useState(!pid)
    const [orders, setOrders] = useState([])
    const [viewOrder, setviewOrder] = useState(false)
    const [orderIndex, setOrderIndex] = useState()

    const close = () => setviewOrder(false)

    useEffect(() => {
        async function GetMaster() {
            const response = await fetch(`/api/get_orders_client?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'get',
            })
            const result = await response.json()
            setOrders(result)            
        }
        if (profile.status) {
            GetMaster()
        } else {
            () => router.push('/')
        }

    }, [])

    function SetViewOrder(a) {
        setviewOrder(true)
        setOrderIndex(a)
    }
   
    function ActiveOrder(a) {
        let date_order = a.split(',')
        let mon = months.indexOf(date_order[1])
        let d = new Date();

        if (mon >= d.getMonth() && +date_order[0] >= d.getDate()) {
            return true
        } else {
            return false
        }

    }
    return (
        <main className={styles.main}>
            <Header text={profile.nikname} />
            <div className={styles.profile} style={{ backgroundImage: "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' ? "url(" +  url + '/var/data/' + profile.nikname + '/main.jpg)' : "url(/camera_bl.svg" }}>
                <h2>{profile.name}</h2>
                <p>{profile.text}</p>
            </div>
            <div className={styles.selector} onClick={(e) => setSelector(+e.target.id)}>
                <span id="1" style={selector ? sel : null}>Сохранённое</span>
                <span id="0" style={selector ? null : sel}>Заказы</span>
            </div>
            {selector ? 
                <>
                    {/* <div className={styles.message} >
                        Здесь будут храниться ваши сохраненные работы <br />
                        мастеров, что бы не терять понравившееся из виду. <br />
                        Хотите что-то присмотреть?
                    </div> */}
                    <div className={styles.images}>
                        {['one', 'two', 'three', 'four', 'five'].map(i =>
                            <div key={i} style={{ backgroundImage: `url(/image/${i}.jpg)` }} />)}
                    </div>
                    {/* <Link href="/masternear" className={styles.uslugi}>Мастера рядом</Link> */}

                </>
                : 
                <>
                    {orders?.map((i, index) =>
                        <>
                        <div
                            onClick={() => SetViewOrder(index)}
                            key={i.order}
                            className={styles.order}
                        >
                            <p>
                                <span className={ActiveOrder(i.date_order) ? styles.active : null}>
                                    {i.date_order.replace(',', " ").replace(',', " в ")}
                                </span>
                                <span>#{i.id}</span>
                            </p>
                            <h3><span>{i.master_name || i.master}</span><span>{i.price} BYN</span></h3>
                            <h6>{i.neworder.split(',').map((i, index) => <span key={index}>{((index > 0 ? ' , ' : ' ') + i.split(':')[0])}</span>)}</h6>
                            
                        </div>                       
                        </>
                    )}
                    {viewOrder ? <ClientOrder order={orders[orderIndex]} active={ActiveOrder(orders[orderIndex].date_order)} close={close} /> : null }                   
                </>
            }

        </main>
    )
}