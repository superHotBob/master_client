import styles from './client.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'
import ClientOrder from '@/components/orderclient'
const url = 'https://masters-client.onrender.com'
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}


const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { slug } = router.query
    const profile = useSelector((state) => state.counter.profile)

    const [data, setData] = useState([])
    const [viewOrder, setviewOrder] = useState(false)
    const [orderIndex, setOrderIndex] = useState()



    const close = () => setviewOrder(false)

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem('profile'))
        if (pro.nikname === slug) {
            fetch(`/api/get_orders_client?nikname=${pro.nikname}`)
                .then(res => res.json())
                .then(res => setData(res))
        } else { router.push('/') }
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
            <Header text={profile.nikname} sel="back" />
            <div className={styles.profile} style={{ backgroundImage: "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' ? "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' : "url(/camera_bl.svg" }}>
                <h2>{profile.name}</h2>
                <p>{profile.text}</p>
            </div>
            <div className={styles.selector}>
                <Link href={`/clientprofile/${slug}`} >Сохранённое</Link>
                <Link href={`/clientprofile/${slug}/orders`} style={sel}>Заказы</Link>
            </div>
            {data?.map((i, index) =>
                <div
                    onClick={() => SetViewOrder(index)}
                    key={i.id}
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
            )}
            {viewOrder ? <ClientOrder order={data[orderIndex]} active={ActiveOrder(data[orderIndex].date_order)} close={close} /> : null}



        </main>
    )
}