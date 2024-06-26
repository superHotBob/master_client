import Link from 'next/link'
import { useState } from 'react'
import styles from './services.module.css'
import { useDispatch } from 'react-redux'
import { setservice } from '@/reduser'
import { useRouter } from 'next/router'
import { category } from '@/data.'
import useSWR from 'swr'
import { useSelector } from 'react-redux'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 500,
    color: '#fff'
}
const My_Events = () => {
    const state = useSelector(state=>state.counter.mystate)
    const { data: events } = useSWR(`/api/get_events?state=${state.toLowerCase()}`)

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


    const toService = ( e ) => {
        if( category.includes(e.target.id)) {
            dispatch(setservice(e.target.id))
            router.push(`/masternear/${e.target.id}`)
        }       
    }
    return (
        <>            
            <div className={styles.selector}>
                <span onClick={() => setSelector(true)} style={selector ? sel : null}>Каталог услуг</span>
                <span onClick={() => setSelector(false)} style={selector ? null : sel}>Мероприятия</span>
            </div>
            {selector ? 
                <div className={styles.images} onClick={toService}>
                    {category.map(i =>
                        <img key={i} id={i} alt={i} src={'/' + i + '.svg'} width='100px' height='auto' />

                    )}
                </div>
               :
                <My_Events />
            }
        </>
    )
}  