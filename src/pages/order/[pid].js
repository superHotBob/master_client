import styles from './order.module.css'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'


const fetcher = (...args) => fetch(...args).then(res => res.json())
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сетнябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export default function Order() {
    const router = useRouter()   
    const [viewReview, setViewReview] = useState(false)
    const [color, setColor] = useState()
    const [result, setresult] = useState(false)
    const ref = useRef(null)
    const [stars, setStars] = useState()
    const { pid } = router.query
    const { data } = useSWR(`/api/get_order_master?id=${pid}`, fetcher)

    function SendReview() {
        if (viewReview) {
            console.log('review', ref.current.value, 'stars:', stars)
        } else {
            setViewReview(true)
        }
    }
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setColor(pro.color)       
    }, [])
    async function DeleteOrder() {
        const my_data = { id: data.id }
        const response = await fetch('/api/delete_order', {
            body: JSON.stringify(my_data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })        
        if (response.status === 200) {
            setresult('Ваш заказ отменён')
        }

    }
    function NewOrder(a) {
        let date_order = a.split(',')       
        let mon =  months.indexOf(date_order[1])
        let d = new Date();            
        if (mon >= d.getMonth() && +date_order[0] >= d.getDate()) {
            return true
        } else {
            return false
        }
    }
    return (
        <main className={styles.main}>
            {data && color ? <>
                <header>
                    <b onClick={() => router.back()} /><span>#{data.id}</span><span style={{ color: color[1] }}>Готово</span>
                </header>
                <section className={styles.data} style={{ color: color[1] }}>
                    <h5>Клиент</h5>
                    <span style={{ fontWeight: 400 }}>
                        <b style={{fontWeight: 500, color: '#3D4EEA' }}>{data.client}</b>{' '}({data.client_name})
                    </span>
                    <h5>Дата и время</h5>
                    <span>{data.date_order.replace(/,/g, ' ')}</span>
                    <h5>Услуги и стоимость</h5>
                    <span>{data.new_order}</span>
                    <span>Стоимость {data.price} BYN</span>
                    <h5>Дополнительное описание</h5>
                    <span>{data.neworder.replace(/[0-9]/g, '  ').replace(/:/g, ' ')}</span>
                    {NewOrder(data.date_order) ? 
                        <button onClick={DeleteOrder}>
                            <b>Отменить заказ</b>
                            </button>
                            :
                            <div className={styles.review} >
                                Отзыв
                                <h3>{data.review}</h3>
                            </div>
                    }
                </section> 
            </> : null}
            {result ? <p>{result}</p> : null}
        </main>
    )
}