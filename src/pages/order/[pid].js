import styles from './order.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Convert_Date, NewOrder } from '@/profile'
import { Detail } from '@/components/clientorder'

export default function Order() {

    const router = useRouter()
    const [color, setColor] = useState()
    const [result, setresult] = useState(false)
    const { pid } = router.query

    const { data: order } = useSWR(pid ? `/api/get_order_master?id=${pid}` : null)

    
   
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setColor(pro.color)       
    }, [router,order])
   
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

    // async function EditSchedule() {
    //     const my_data = {
    //         nikname: order.master,
    //         month: order.date_order.split(',')[1].toLowerCase()
    //     }
    //     await fetch(`/api/get_schedule?nikname=${my_data.nikname}&month=${my_data.month}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             let new_schedule = data;
    //             let new_days = new_schedule[order.date_order.split(',')[0] - 1] + ',' + order.date_order.split(',')[2];
    //             new_schedule[order.date_order.split(',')[0] - 1] = new_days;
    //             my_data['schedule'] = new_schedule;

    //         })

    //     fetch('/api/edit_schedule', {
    //         body: JSON.stringify(my_data),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //     })
    //     .then(res => router.push('/masterrecords'))

    // }

    return (
        <main className={styles.main}>
            <header>
                <b onClick={() => router.back()} />
                <span>#{pid}</span>
                <span style={{ color: color ? color[1] : null }}>Готово</span>
            </header>


            <section className={styles.data} style={{ color: color ? color[1] : null }}>
                <h5>Клиент</h5>
                <Detail order={order} />             
                {NewOrder(order?.date_order) ?
                    <button onClick={DeleteOrder}>
                        <b>Отменить заказ</b>
                    </button>
                    :
                    <div className={styles.review} >
                        Отзыв
                        <h3>{order?.review}</h3>
                    </div>
                } 
            </section>
            {result ? <p>{result}</p> : null}
        </main>
    )
}