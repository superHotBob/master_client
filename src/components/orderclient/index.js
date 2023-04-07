import Link from 'next/link'
import { useState, useRef } from 'react'
import React from 'react'
import styles from './order.module.css'
import star from '../../../public/star-small.svg'
import star_gray from '../../../public/star-gray.svg'
import Image from 'next/image'

const review = {
    backgroundColor: '#3D4EEA',
    fontWeight: 600,
    
}

export default function ClientOrder({ order, active, close }) {
    const [new_review, setreview] = useState(true)
    const [result, setresult] = useState(false)
    const [stars, setstars] = useState(0)
    const ref = useRef()
    async function SendReview() {
        const data = {
            review: ref.current.
                value, id: order.id,
            stars: stars
        }
        const response = await fetch('/api/add_review', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (response.status === 200) {
            setresult('Ваш отзыв добавлен')
        }

    }
    function SetStars(a) {
        if (a === stars) {
            setstars(a - 1)
        } else {
            setstars(a)
        }
    }
    async function DeleteOrder() {
        const data = { id: order.id }
        const response = await fetch('/api/delete_order', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        console.log(response.status)
        if (response.status === 200) {
            setresult('Ваш заказ отменён')
        }

    }
    return (
        <section className={styles.data} >
            <header>
                <b onClick={close} /><span>#{order.id}</span>
            </header>
            {new_review ?
                <>
                    <h5>Мастер</h5>
                    <h5 style={{ fontWeight: 400 }}>
                        <Link href={'/master/' + order.master} style={{ color: '#3D4EEA' }}>{order.master_name || order.master}{' '}</Link>({order.master})
                    </h5>
                    <h5>Дата и время</h5>
                    <span>{order.date_order.replace(',', " ").replace(',', " в ") + ':00'}</span>
                    <h5>Услуги и стоимость</h5>
                    <span>{order.text}</span>
                    <span>Стоимость {order.price} BYN</span>
                    <h5>Дополнительное описание</h5>
                    <span>
                        {order.neworder.split(',').map((i, index) => <span key={index}>{((index > 0 ? ' , ' : ' ') + i.split(':')[0])}</span>)}
                    </span>
                    {active ?
                        <button onClick={DeleteOrder}><b>Отменить заказ</b></button>
                        :
                        <button style={review} onClick={() => setreview(false)}>Оставить отзыв</button>
                    }
                    {result ? <p className={styles.res}>{result}</p> : null}
                </>
                :
                <div className={styles.my_review}>
                    <label>
                        Отзыв
                        <textarea ref={ref} className={styles.my_text} placeholder="Расскажите о заказе" rows={6} />
                    </label>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(i => <React.Fragment key={i}>{
                            stars >= i ? <Image 
                                alt="star"
                                onClick={() => SetStars(i)}
                                src={star}
                                width={25} height={24}
                            /> : <Image 
                                alt="star"
                                onClick={() => SetStars(i)}
                                src={star_gray}
                                width={25} height={24}
                        />
                        }</React.Fragment>

                        )}
                    </div>
                    {result ? <p>{result}</p> : null}
                    <button style={review} onClick={SendReview}>Оставить отзыв</button>
                </div>
            }
        </section>
    )
}