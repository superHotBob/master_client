import Header from '@/components/header'
import Link from 'next/link'
import styles from './event.module.css'

import useSWR from 'swr'
import { url } from '@/data.'




export default function Event() {

    const { data, error , mutate } = useSWR('/api/get_events')

    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    function My_Date(a) {        
        const message_date = new Date(+a)
        const current_date = new Date()
        if (message_date.getDate() === current_date.getDate()) {
            return message_date.toLocaleDateString('ru-RU', options)
        }
        return message_date.toLocaleDateString('ru-RU', options)
    }
    return (
        <>
            <Header text="Мероприятия" sel="/catalog/services" />           
            {data?.map(i=>
                <section key={i.event_id} className={styles.event}>
                    <img src={url + '/var/data/' + i.master_nikname + '/main.jpg'} alt="master" height={50} width={50}/>
                    <p>
                        {i.name}<br />
                        <span className={styles.pro}>MASTER</span>
                        {i.stars === '0.0' ? null : <span className={styles.stars}>{i.stars}</span>}
                    </p>
                    <h3>{i.event_text}</h3>
                    <h4>{i.address}</h4>
                    <h5 style={{color: '#000',margin: '8px 0'}}>{My_Date(i.date_event)}</h5>
                    <h5>{i.services.map(m => <span key={m}>{m}</span>)}</h5>              
                    <Link href={`/chat/messages/${i.master_nikname}?name=${i.name}`} >
                        <span>Написать мастеру</span>
                    </Link>
                </section>
            )}
           
           
        </>
    )
}
