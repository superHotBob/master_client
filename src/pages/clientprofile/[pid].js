import styles from './client.module.css'
import { useRouter } from 'next/router'
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
    const { pid } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [selector, setSelector] = useState('orders')
    const [orders, setOrders] = useState([])
    const [viewOrder, setviewOrder] = useState(false)
    const [orderIndex, setOrderIndex] = useState()

    const close = () => setviewOrder(false)
    const { data, error, isLoading } = useSWR(selector === 'orders' ? `/api/get_orders_client?nikname=${pid}` :
        `/api/get_saved_image?nikname=${profile.nikname}`, fetcher)

    useEffect(() => {
        if (profile?.status === 'client') {
        } else { router.push('/') }
    }, [])

    function SetViewOrder(a) {
        setviewOrder(true)
        setOrderIndex(a)
    }
    function GoToMaster(e, a) {
        let master = a.slice(0, a.indexOf('/'))
        router.push(`/master/${master}`)
    }
    function Delete_image(a) {
        let pro = JSON.parse(localStorage.getItem('profile'))
        let new_saved = [...pro.saved_image]
        const del_image = new_saved.filter(i => i !== a)
        fetch('/api/saves_image', {
            body: JSON.stringify({ image: del_image, nikname: profile.nikname }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res => {
            const new_profile = { ...profile, saved_image: del_image }
            localStorage.setItem('profile', JSON.stringify(new_profile))

        })
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
            <div className={styles.profile} style={{ backgroundImage: "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' ? "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' : "url(/camera_bl.svg" }}>
                <h2>{profile.name}</h2>
                <p>{profile.text}</p>
            </div>
            <div className={styles.selector} onClick={(e) => setSelector(e.target.id)}>
                <span id="image" style={selector === 'image' ? sel : null}>Сохранённое</span>
                <span id="orders" style={selector === 'image' ? null : sel}>Заказы</span>
            </div>
            {selector === 'image' ?
                <>
                    {/* <div className={styles.message} >
                        Здесь будут храниться ваши сохраненные работы <br />
                        мастеров, что бы не терять понравившееся из виду. <br />
                        Хотите что-то присмотреть?
                    </div> */}
                    <div className={styles.images}>
                        <section>
                            {data?.filter((i, index) => index % 2 === 0).map(i =>
                                <div key={i}>
                                    <img title={i.slice(0, i.indexOf('/'))} onClick={(e) => GoToMaster(e, i)} alt="image" src={url + '/var/data/' + i} />
                                    <span
                                        className={styles.save__image}
                                        onClick={() => Delete_image(i)}
                                    />
                                </div>
                            )}
                        </section>
                        <section>
                            {data?.filter((i, index) => index % 2 !== 0).map(i =>
                                <div key={i}>
                                    <img title={i.slice(0, i.indexOf('/'))} onClick={(e) => GoToMaster(e, i)} alt="image" src={url + '/var/data/' + i} />
                                    <span
                                        className={styles.save__image}
                                        onClick={() => Delete_image(i)}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                    {/* <Link href="/masternear" className={styles.uslugi}>Мастера рядом</Link> */}

                </>
                :
                <>
                    {data?.map((i, index) =>
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
                    {viewOrder ? <ClientOrder order={data[orderIndex]} active={ActiveOrder(data[orderIndex].date_order)} close={close} /> : null}
                </>
            }

        </main>
    )
}