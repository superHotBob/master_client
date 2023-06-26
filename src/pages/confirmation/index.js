import Header from '@/components/header'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import styles from './confirmation.module.css'
import { Bov } from '../recordingtomaster'
import { useState, useEffect } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())
export default function Confirmation() {
    const router = useRouter()
    const order = useSelector(state => state.counter.order)
    const master = useSelector(state => state.counter.master)
    const date = useSelector(state => state.counter.date_order)
    const [goodorder, setgoodorder] = useState(false)
    const { data } = useSWR(`/api/get_full_address?nikname=${master.nikname}`, fetcher)


    const SaveOrder = () => {
        const profile = JSON.parse(localStorage.getItem('profile'))
        const data = {
            client: profile.status === 'client' ? profile.nikname : master.nikname,
            client_name: profile.status === 'client' ? profile.name : master.name,
            master: master.nikname,
            master_name: master.name,
            price: Cost(order),
            order: order,
            date: date,
        }
        fetch('/api/save_order', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res=>ConfirmOrder())
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

    function ConfirmOrder() {
        setgoodorder(true)
    }

    function Cost() {
        if (order.length > 0) {
            let cost = order.map(i => +i.split(':')[1])
            let sum = cost.reduce((i, a) => a + i)
            return sum
        } else {
            () => router.push('/')
        }

    }
    console.log(date)
    return (
        <>
            <Header sel="back" text="Подтверждение заказа" />
            <section className={styles.order}>
                <h3>Ваш заказ
                    {order.length ?
                        <span className={styles.world_for_count}>{order.length} {World(order.length)}</span>
                        : null}
                </h3>
                <h4>Услуги:</h4>
                {order?.map((i,index) =>
                    <p className={styles.uslugi} key={index}>
                        {i.split(':').map((a, index) => <span key={index}>{a} {index === 1 ? ' BYN' : null}</span>)}
                    </p>)}



                <h4>Адрес:</h4>
                Ул. {master.address}, дом {data?.дом}, кв.{data?.квартира}, этаж {data?.этаж}
                <h4>Дата: </h4>
                <span className={styles.date}>{date.replace(/,/g,' , ')}</span>
                <h3>Сумма</h3>

                <p className={styles.summa}><span>Услуги и товары ({order.length})</span><span>{Cost()} BYN</span></p>
              
                {/* <Link href="#" className={styles.my_sale}>Скидка</Link> */}
                <h3>Общая стоимость<span>{Cost(order)} BYN</span></h3>
                <div onClick={SaveOrder}>Записаться</div>
                <Bov />
                {goodorder ? <div className={styles.goodorder}>
                    <h3>master.place</h3>
                    <h1>УСПЕШНО</h1>
                    <h4>
                        Заказ создан, свяжитесь с мастером, что-бы <br /> не потерять друг-друга.
                    </h4>
                    <Link href={`/chat/messages/${master.nikname}?name=${master.name}`}>Открыть чат с мастером</Link>
                    <h6 onClick={() => setgoodorder(false)}>Закрыть</h6>
                </div> : null}
            </section>
        </>
    )
}