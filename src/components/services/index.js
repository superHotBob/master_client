import Image from 'next/image'
import styles from './services.module.css'
import useSWR from 'swr'
import { Fragment, useState } from 'react'

export default function Services({ color, name, view, currency }) {
    const [viewReview, setViewReview] = useState({})
    const { data, error, isLoading } = useSWR(`/api/master_service?nikname=${name}&view=${view}`)
   
    
    if (error) return <div>Ошибка загрузки</div>
    if (isLoading) return <h3 className={styles.upload__message}>Загрузка услуг...</h3>
    if (data.length) {
        return <>
            {Object.entries(data[0]).map(i => i[1]?.length > 0 ? i[0] : null).filter(i => i)?.map((i,ind) =>
                <div className={styles.data} key={i}>
                    <h3 className={styles.type}>{i}</h3>
                    {data[0][i]?.map((a, index) =>
                        <div key={index} className={styles.all_service}>
                            <Fragment key={a}>
                                <h5 className={styles.service} >
                                    <span>{a.split('~')[0]}</span>
                                    <span>{a.split('~')[1]} {currency}</span>
                                    <Image
                                        src='/chevron_up.svg'
                                        height={26}
                                        width={26}
                                        className={viewReview.id === index + 1 && viewReview.service === i ? styles.image : styles.image_rotate}
                                        alt='arrow'
                                        onClick={() => 
                                            setViewReview(viewReview.id === index + 1 && viewReview.service === i  
                                            ? {} 
                                            :  
                                            {...viewReview,id:index + 1,service: i})}
                                    />
                                </h5>
                                {viewReview.id === index + 1 && viewReview.service === i ? a.split('~')[2] : ''}
                            </Fragment>
                        </div>
                    )}
                </div>
            )}

        </>
    }

}