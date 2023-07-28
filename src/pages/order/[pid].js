import styles from './order.module.css'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import { Convert_Date } from '@/profile'


const fetcher = (...args) => fetch(...args).then(res => res.json())
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export default function Order() {
    const router = useRouter()
   
    const [color, setColor] = useState()
    const [result, setresult] = useState(false)
   
   
    const { pid } = router.query
    const { data: order } = useSWR(`/api/get_order_master?id=${pid}`, fetcher)
    

   
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setColor(pro.color)

    }, [])
    async function DeleteOrder() {
        const my_data = { id: order.id }
        const response = await fetch('/api/delete_order', {
            body: JSON.stringify(my_data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (response.status === 200) {
            setresult('Ваш заказ отменён')
            EditSchedule()
        }

    }
    if (order) {
        console.log(order)
    }
    async function EditSchedule() {
        const my_data = {
            nikname: order.master,
            month: order.date_order.split(',')[1].toLowerCase()            
        } 
        await  fetch(`/api/get_schedule?nikname=${my_data.nikname}&month=${my_data.month}`)
        .then(res => res.json())
        .then(data =>{
            let new_schedule = data;
            let new_days = new_schedule[order.date_order.split(',')[0]-1] + ',' + order.date_order.split(',')[2];           
            new_schedule[order.date_order.split(',')[0] - 1] = new_days;
            my_data['schedule'] = new_schedule;
            
        }) 
       
        fetch('/api/edit_schedule', {
            body: JSON.stringify(my_data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        .then(res => router.push('/masterrecords'))

    }
    function NewOrder(a) {
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
            {order && color ? <>
                <header>
                    <b onClick={() => router.back()} /><span>#{order.id}</span><span style={{ color: color[1] }}>Готово</span>
                </header>
                <section className={styles.data} style={{ color: color[1] }}>
                    <h5>Клиент</h5>
                    <span style={{ fontWeight: 400 }}>
                        <b style={{ fontWeight: 500, color: '#3D4EEA' }}>{order.client}</b>{' '}({order.client_name})
                    </span>
                    <h5>Дата и время</h5>
                    <span>{Convert_Date(order.date_order)}</span>
                    <h5>Услуги и стоимость</h5>
                    <span>{order.new_order}</span>
                    <span>Стоимость {order.price} BYN</span>
                    <h5>Дополнительное описание</h5>
                    <span>{order.neworder.replace(/[0-9]/g, '  ').replace(/:/g, ' ')}</span>
                    {NewOrder(order.date_order) ?
                        <button onClick={DeleteOrder}>
                            <b>Отменить заказ</b>
                        </button>
                        :
                        <div className={styles.review} >
                            Отзыв
                            <h3>{order.review}</h3>
                        </div>
                    }
                </section>
            </> : null}
            {result ? <p>{result}</p> : null}
        </main>
    )
}