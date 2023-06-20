import Header from '@/components/header'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import styles from './confirmation.module.css'
export default function Confirmation() {

    const order = useSelector(state=>state.counter.order)
    console.log(order)
    // function AddOrder(a) {
    //     if (orders.includes(a)) {
    //         let ord = orders.filter(i => i == a ? 0 : 1)
    //         addOrder(ord)
    //         let ind = count.indexOf(active_category)
    //         count[ind] = ''
    //     } else {
    //         addOrder(orders => ([...orders, a]))
    //         setCount(count => ([...count, active_category]))
    //     }
    // }
    return (
        <>
        <Header sel="back" text="Подтверждение заказа"/>
        <section className={styles.main_block}>
            <h3>Ваш заказ<span></span></h3>
            <h4>Услуги:</h4>
            <p><b></b></p>
            <h3>Сумма<span></span></h3>
            <p><b></b></p>
            <p><b></b></p>
            <Link href="#">Скидка</Link>
            <h4>Адрес:</h4>
            <h3>Общая стоимость<span></span></h3>
            <div >Записаться</div>
        </section>
        </>
    )
}