import Header from '@/components/header'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import styles from './event.module.css'
import useSWR from 'swr'
import { url } from '@/data.'




export default function Event() {
    const router = useRouter()   
    const  status  = useSelector(state=>state.counter.profile['status'])
    const city = useSelector(state=>state.counter.city)
    const { data } = useSWR(`/api/get_events?city=${city.toLowerCase()}`)
    console.log(status)

    function My_Date(a) {        
        const message_date = new Date(+a)
        const current_date = new Date()
        if (message_date.getDate() === current_date.getDate()) {
            return message_date.toLocaleDateString('ru-RU', options)
        }
        return message_date.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
                    <button disabled = {status !='client'} onClick={()=>router.push(`/chat/messages/${i.master_nikname}?name=${i.name}`)} >
                        <span>Написать мастеру</span>
                    </button>
                </section>
            )}
           
           
        </>
    )
}
