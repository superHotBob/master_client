import styles from './order.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { NewOrder } from '@/profile'
import { Detail } from '@/components/clientorder'

export default function Order() {

    const router = useRouter()
    const [color, setColor] = useState()
    const [result, setresult] = useState(false)
    const { pid } = router.query

    const { data: order, isLoading } = useSWR(pid ? `/api/get_order_master?id=${pid}` : null)

   
   
    useEffect(() => {
        let { color } = JSON.parse(localStorage.getItem("profile"))
        setColor(color)       
    }, [order])
   
    async function DeleteOrder() {
        const my_data = { id: order.id, nikname: order.master }
        const response = await fetch('/api/delete_order', {
            body: JSON.stringify(my_data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (response.status === 200) {
            setresult('Ваш заказ отменён')
            router.back()
           
        }

    }


    if(isLoading) {
        console.log('isLoading')
        return;
    }


    return (
        <main className={styles.main}>
            <header>
                <b onClick={() => router.back()} />
                Заказ #{pid}
                {/* <span style={{ color: color ? color[1] : null }}>Готово</span> */}
            </header>
            {order ? <section className={styles.data} style={{ color: color ? color[1] : null }}>
                <h5>Клиент {order?.client_name}</h5>
                <Detail order={order} />             
                {NewOrder(order?.date_order, order?.order_month, order?.year ) ?
                    <button onClick={DeleteOrder}>
                        <b>Отменить заказ</b>
                    </button>
                    :
                    <div className={styles.review} >
                        Отзыв
                        <h3>{order?.review}</h3>
                    </div>
                } 
            </section> : null}
            {result ? <p>{result}</p> : null}
        </main>
    )
}