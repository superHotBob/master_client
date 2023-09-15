import Link from 'next/link'
import { useState } from 'react'
import styles from './services.module.css'
import { useDispatch } from 'react-redux'
import { setservice } from '@/reduser'
import { useRouter } from 'next/router'
import { my_data } from '@/data.'
import useSWR from 'swr'
import { useSelector } from 'react-redux'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}
const My_Events = () => {
    const city = useSelector(state=>state.counter.city)
    const { data: events } = useSWR(`/api/get_events?city=${city.toLowerCase()}`)

    if (events?.length === 0) {
        return <h3 className={styles.message}>Мероприятий нет</h3>
    }
    return <div className={styles.events}>
        {events?.length > 0 ?
            <Link href="/event" className={styles.model}>
                СТАТЬ МОДЕЛЬЮ <br />БЕСПЛАТНО
            </Link>
            : 
            null
        }
    </div>
}
export default function Services() {
    const [selector, setSelector] = useState(true)
    const dispatch = useDispatch()
    const router = useRouter()


    function ToService(event) {
        if( my_data.category.includes(event.target.id)) {
            dispatch(setservice(event.target.id))
            router.push(`/masternear/${event.target.id}`)
        }
       
    }
    return (
        <>
            
            <div className={styles.selector}>
                <span onClick={() => setSelector(true)} style={selector ? sel : null}>Каталог услуг</span>
                <span onClick={() => setSelector(false)} style={selector ? null : sel}>Мероприятия</span>
            </div>
            {selector ? 
                <div className={styles.images} onClick={ToService}>
                    {my_data.category.map(i =>
                        <img key={i} id={i} alt="image" src={'/' + i + '.svg'} width='100%' height='auto' />

                    )}
                </div>
               :
                <My_Events />
            }
        </>
    )

}  