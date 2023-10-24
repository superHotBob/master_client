import Image from 'next/image'
import { useState, Fragment } from 'react'
import React from 'react'
import styles from './reviews.module.css'
import star from '../../../public/star-small.svg'
import star_gray from '../../../public/star-gray.svg'
import { Convert_Date } from '@/profile'
import useSWR from 'swr'


export default function Reviews({ nikname }) {

    const { data: reviews, isLoading } = useSWR(`/api/get_orders_master_review?nikname=${nikname}`)
    const [view, setView] = useState(null)

    if (isLoading) {
        return <h4 className={styles.mess}> Загрузка отзывыв...</h4>
    }
    if (reviews?.length === 0) {
        return <h4 className={styles.mess}> Отзывов  пока нет</h4>
    }

    return <>
        {reviews?.map(i =>
            <div className={styles.data} key={i.id}>
                <div className={styles.header}>
                    <span>{i.client_name}</span>
                    <span style={{ textAlign: 'right', width: '39%', color: '#000' }}>
                        {Convert_Date(i.date_order, i.order_month, i.year)}
                    </span>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(a =>
                            <Image
                                alt="star"
                                key={a}
                                src={i.stars >= a ? star : star_gray}
                                width={15} height={14}
                            />
                        )}
                    </div>
                </div>
                <p className={styles.service}>
                    {i.neworder.replace(/[0-9]/g, '').replace(':', '')}, {i.price} BYN
                </p>
                <p className={styles.message}>{view === i.id ? i.review : i.review.length > 80 ? i.review.slice(0, 145) + '...' : i.review}</p>
                {i.review.length > 80 ? <span onClick={() => setView(view === i.id ? null : i.id)}>
                    {view != i.id ? 'подробнее' : 'скрыть'}
                </span> : null}
            </div>
        )}
    </>
}