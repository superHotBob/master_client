import styles from './order.module.css'
import Link from "next/link"
import useSWR from 'swr'
import { Convert_Date } from '@/profile'



export default function OrderMessage({ id, color }) {
    if (!isNaN(id)) {        
        const { data: order, isLoading } = useSWR(id ? `/api/get_order?id=${id}` : null)
        if(isLoading) return <p>Загрузка...</p>
        return <div style={{ color: color }} className={styles.order}>
            <p className={styles.order_create}>Создан заказ </p>
            <h5 className={styles.details}>Детали заказа:</h5>
            <p>{order.myorder?.map(i => i.split(':')[0]) + '.'}</p>
            <h5>Дата встречи:</h5>
            <p>{Convert_Date(order?.date_order)}</p>
            <h5>Адрес встречи:</h5>
            <p>Ул. {order.улица} , дом: {order.дом} , кв: {order.квартира} </p>
            <p>Сумма: {order.price} BYN</p>
            <Link className={styles.link} style={{ color: color }} href={'/order/' + id}>Подробнее</Link>
        </div>
    } else {
        return id
    }

}