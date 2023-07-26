import Image from 'next/image'
import { useState } from 'react'
import React from 'react'
import styles from './reviews.module.css'
import star from '../../../public/star-small.svg'
import star_gray from '../../../public/star-gray.svg'
import { Convert_Date } from '@/profile'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Reviews({ nikname, color }) {

    const { data: reviews, isLoading } = useSWR(`/api/get_orders_master_review?nikname=${nikname}`, fetcher)
    const [view, setView] = useState(true)

    if (isLoading) {
        return <h3> Загружаем отзывы ...</h3>
    }

    return <>

        {reviews?.map((i, index) =>
            <div className={styles.data} key={index}>
                <div className={styles.header}>
                    <span>{i.client_name || i.client}</span>
                    <span style={{ textAlign: 'right', width: '55%', color: '#000' }}>
                        {Convert_Date(i.date_order)}
                    </span>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(a => <React.Fragment key={a}>{
                            i.stars >= a ?
                                <Image
                                    alt="star"
                                    src={star}
                                    width={15} height={14}
                                />
                                :
                                <Image
                                    alt="star"
                                    src={star_gray}
                                    width={15} height={14}
                                />
                        }</React.Fragment>

                        )}
                    </div>
                </div>
                <p className={styles.service}>
                    {i.neworder.replace(/[0-9]/g, '').replace(':', '')}, {i.price} BYN
                </p>
                <p className={styles.message}>{view ? i.review.slice(0, 145) + '...' : i.review}</p>
                <span style={{ color: color[2] }} onClick={() => setView(view ? false : true)}>
                    {view ? 'подробнее' : 'скрыть'}
                </span>
            </div>)}


    </>
}