import Image from 'next/image'
import { useState, useEffect } from 'react'
import React from 'react'
import styles from './reviews.module.css'
import star from '../../../public/star-small.svg'
import star_gray from '../../../public/star-gray.svg'

export default function Reviews({nikname,color}) {

    const [view, setView] = useState(false)
    const [reviews, setreview] = useState()

    useEffect(() => {
        async function GetReview() {
            const response = await fetch(`/api/get_orders_master_review?nikname=${nikname}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
              
                method: 'get',
            })           
            const result = await response.json()                
            setreview(result)
        }       
        GetReview()
    }, [])
    return (
        <main className={styles.main}>
            {reviews?.map((i,index) => 
            <div className={styles.data} key={index}>
                <div className={styles.header}>
                    <span>{i.client_name||i.client}</span>
                    <span style={{textAlign: 'right',width: '55%',color: '#000'}}>
                        {i.date_order.split(',')[0] }, {i.date_order.split(',')[1] }, в {i.date_order.split(',')[2]}
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
                    {i.neworder.replace(/[0-9]/g,'').replace(':','')}, {i.price} BYN
                </p>
                {view  ?
                    <p className={styles.message} style={{color: color[1]}}>
                        {i.review.slice(0,145) + '...'}
                    </p>
                    :
                    <p className={styles.message}>{i.review}</p>
                }
                <span  style={{color: color[2]}} onClick={()=>setView(view ? false: true)}>{view ?'подробнее':'скрыть' }</span>
            </div>)}

        </main>
    )
}