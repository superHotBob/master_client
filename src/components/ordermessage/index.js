import styles from './order.module.css'
import Link from "next/link"
import useSWR from 'swr'
import { Convert_Date } from '@/profile'



export default function OrderMessage({ id, color }) {
    const { data: order, isLoading } = useSWR( !isNaN(id) ? `/api/get_order?id=${id}` : null)
    if(isLoading) return <p>Загрузка...</p>
    if (!isNaN(id)) {       
        return <div style={{ color: color }} className={styles.order}>
            <p className={styles.order_create}>Создан заказ </p>
            <h5 className={styles.details}>Детали заказа:</h5>
            <p>{order.myorder?.map(i => i.split('~')[0]) + '.'}</p>
            <h5>Дата встречи:</h5>
            <p>{Convert_Date(order?.date_order, order?.order_month, order?.year)}</p>
            <h5>Адрес встречи:</h5>
            <p>{order.улица} , кв. {order.квартира} </p>
            <p>Сумма: {order.price} BYN</p>
            <Link className={styles.link} style={{ color: color }} href={'/order/' + id}>Подробнее</Link>
        </div>
    } else {
        let match = id.match(/\bhttps?\:\/\/(\S+)\b/);
        if(match) {
            let new_str = id.replace(match[0] + '.', '')               
            return new_str
        } else {
            return id
        }        
       
    }

}