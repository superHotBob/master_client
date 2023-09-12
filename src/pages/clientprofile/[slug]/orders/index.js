import styles from '../client.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import ClientOrder from '@/components/clientorder'
import { Convert_Date, NewOrder } from '@/profile'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    // background: '#5E2AF0',
    fontWeight: 500,
    color: '#fff'
}
export default function Client() {
    const router = useRouter()    
    const { slug } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [data, setData] = useState([])
    const [viewOrder, setviewOrder] = useState(false)
    const [orderIndex, setOrderIndex] = useState()
   
   

    const close = () => setviewOrder(false)

    useEffect(() => {        
        if(Object.keys(profile).length === 0) {
            router.push('/')
        } else {
            fetch(`/api/get_orders_client?nikname=${slug}`)
            .then(res => res.json())
            .then(res => setData(res))
        }
          
        
    }, [slug,router])
   

    function SetViewOrder(a) {
        setviewOrder(true)
        setOrderIndex(a)
        window.scrollTo(0, 0);
    }
  
    return (
        <>
            <Header text={profile.nikname} sel="back" />
            <div className={styles.profile}>
                <img src={ process.env.url_image + slug + '.jpg'} alt="client" />
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
                        <span className={NewOrder(i.date_order) ? styles.active : null}>
                            {Convert_Date(i.date_order)}
                        </span>
                        <span>#{i.id}</span>
                    </p>
                    <h3><span>{i.master_name || i.master}</span><span>{i.price} BYN</span></h3>
                    <h6>{i.neworder.split(',').map((i, index) => <span key={index}>{((index > 0 ? ' , ' : ' ') + i.split(':')[0])}</span>)}</h6>

                </div>
            )}
            {viewOrder ? <ClientOrder order={data[orderIndex]} active={NewOrder(data[orderIndex].date_order)} close={close} /> : null}
        </>
    )
}