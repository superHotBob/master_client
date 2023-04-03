import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './reviews.module.css'
import star from '../../../public/star-small.svg'


export default function Reviews({nikname,color}) {

    const [view, setView] = useState(true)
    const [reviews, setreview] = useState()

    useEffect(() => {
        async function GetReview() {
            const response = await fetch(`/api/get_orders_master_review?nikname=${nikname}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // The method is POST because we are sending data.
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
                    <span style={{color: color[1]}}>{i.client_name||i.client}</span>
                    <span style={{textAlign: 'right',width: '55%',color: color[1]}}>
                        {i.date_order.replace(',',' ').replace(',', ' в ')}:00
                    </span>
                    <span>
                    {[1,2,3,4,5].map(i=><Image key={i} alt="star" src={star} width={15} height={14} />)}
                    </span>
                </div>
                <p className={styles.service}>{i.neworder.replace(/[0-9]/g,'').replace(':','')}, {i.price} BYN</p>
                {view !== i.name ?<p className={styles.message} style={{color: color[1]}}>{i.review.slice(0,145)}...</p>:
                <p className={styles.message} >{i.review}</p>}
                <span onClick={()=>setView(view === i.name ? null : i.name)}>{view === i.name ?'скрыть' : 'подробнее'}</span>
            </div>)}

        </main>
    )
}