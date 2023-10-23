import { Convert_Date } from '@/profile'
import styles from './order.module.css'
import { useDispatch } from 'react-redux'
import { setorder } from '@/reduser'
import { useRouter } from 'next/router'
import { my_tema } from '@/data.'


export default function Order({order, profile = 0}) {
    const router = useRouter()
    const dispatch = useDispatch()  

    function ViewOrder(a) {        
        dispatch(setorder(order))
        router.push('/order/' + a)
    }

    return (
        <div
            onClick={() => ViewOrder(order.id)}
            key={order.id}
            className={styles.order}
        >
            <p>
                <span className={order.read ? null : styles.active}>
                    {Convert_Date(order.date_order)}
                </span>
                <span>#{order.id}</span>
            </p>
            <h3>
                <span style={{ color: my_tema[profile].color[1] }}>
                    {order.client === order.master ? <b>Мой заказ</b> : order.client_name}
                </span>
                <span style={{ color: my_tema[profile].color[1] }}>
                    {order.price}{' '}
                    {JSON.parse(localStorage.getItem("profile")).currency}
                </span>
            </h3>
            {order.myorder ?
                <h6 style={{ color: my_tema[profile].color[1] }}>
                    {order.myorder.map((a, index) => <span key={index}>{a.split(":")[0]}</span>)}
                </h6>
                :
                <h6 style={{ color: my_tema[profile].color[1] }}>
                    {order.neworder.replace(/[0-9]/g, ' ').replace(/:/g, ' ')}
                </h6>
            }
        </div>
    )
}