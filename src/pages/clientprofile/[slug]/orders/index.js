import styles from '../client.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ClientOrder } from '@/components/clientorder'
import { Convert_Date, NewOrder } from '@/profile'

import { useDispatch } from 'react-redux'
import { getImage } from '@/data.'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    // background: '#5E2AF0',
    fontWeight: 500,
    color: '#fff'
}
export default function Client() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { slug } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [data, setData] = useState([])
    const [viewOrder, setviewOrder] = useState(false)
    const [orderIndex, setOrderIndex] = useState()



    const close = () => setviewOrder(false)

    useEffect(() => {
        if (Object.keys(profile).length === 0) {
            router.push('/')
        } else {
            fetch(`/api/get_orders_client?nikname=${slug}`)
            .then(res => res.json())
            .then(res => setData(res))
        }
    }, [slug])


    function SetViewOrder(a) {
        setviewOrder(true)
        setOrderIndex(a)
        window.scrollTo(0, 0);
    }

    return (
        <>
            <Header text={profile.nikname} sel="back" />
            <div className={styles.profile}>
                <img src={ getImage(slug) } alt="client" />
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
                        <span className={NewOrder(i.date_order, i.order_month, i.year) ? styles.active : null}>
                            {Convert_Date(i.date_order, i.order_month, i.year)}
                        </span>
                        <span>#{i.id}</span>
                    </p>
                    <h3><span>{i.master_name || i.master}</span><span>{i.price} BYN</span></h3>                   
                    <h6>{i.myorder.map((i, index) => <span key={index}>{i.split('~')[0]}. </span>)}</h6>
                </div>
            )}
            {viewOrder ?
                <ClientOrder
                    order={data[orderIndex]}
                    active={NewOrder(data[orderIndex].date_order, data[orderIndex].order_month, data[orderIndex].year)}
                    close={close}
                />
                : null
            }
        </>
    )
}