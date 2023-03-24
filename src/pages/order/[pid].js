import styles from './order.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useState, useRef } from 'react'
import Image from 'next/image'

const review = {
    backgroundColor: '#3D4EEA'
}

export default function Order() {
    const router = useRouter()
    const order = useSelector(state => state.counter.order)   
    const [viewReview, setViewReview] = useState(false)
    const [review, setReviewText] = useState()
    const ref = useRef(null)
    const [stars, setStars] = useState()
    function SendReview() {
        if (viewReview) {
            console.log('review', ref.current.value, 'stars:',stars)
        } else {
            setViewReview(true)
        }
    }
    return (
        <main className={styles.main}>
            <header>
                <b onClick={()=>router.back()} /><span>#{order.order}</span><span>Готово</span>
            </header>
            {viewReview ? <div className={styles.new_review}>
                <p>Отзыв</p>
                <textarea
                    placeholder='Расскажите о заказе'
                    rows={5}
                    ref={ref}
                />
                <h3>
                    {[1, 2, 3, 4, 5].map(i => <Image key={i} onClick={()=>setStars(i)} src='/star_bl.svg' alt='star' width={25} height={24} />)}
                </h3>
            </div> : null}
            <section className={styles.data}>
                {order['client']  ?
                <>
                <h5>Клиент</h5>
                <h5 style={{ fontWeight: 400 }}>
                    <b style={{ color: '#3D4EEA' }}>{order.client}</b>
                </h5>
                </>
                :
                <>
                <h5>Мастер</h5>
                <h5 style={{ fontWeight: 400 }}>
                    <b style={{ color: '#3D4EEA' }}>{order.name}</b>{' '}({order.nikname})
                </h5>
                </>}
                <h5>Дата и время</h5>
                <span>{order.date}</span>
                <h5>Услуги и стоимость</h5>
                <span>{order.text}</span>
                <span>Стоимость {order.cost} ₽</span>
                <h5>Дополнительное описание</h5>
                <span>{order.text}</span>
                {order.active ?
                    <button><b>Отменить заказ</b></button>
                    :
                    <button style={review} onClick={SendReview}>Оставить отзыв</button>
                }


            </section>
        </main>
    )
}