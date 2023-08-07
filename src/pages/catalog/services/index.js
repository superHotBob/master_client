import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './services.module.css'
import { useDispatch } from 'react-redux'
import { setservice } from '@/reduser'
import { useRouter } from 'next/router'

import useSWR from 'swr'

const images = ['маникюр', 'педикюр', 'макияж', 'ресницы', 'брови', 'депиляция', 'массаж', 'стрижка', 'окрашивание', 'прически', 'барбер', 'чистка']


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}

const My_Events = () => {
    const { data: events } = useSWR('/api/get_events')

    if (events?.length === 0) {
        return <h3 className={styles.message}>Мероприятий нет</h3>
    }
    return <div className={styles.events}>
        {events?.length > 0 ?
            <Link href="/events" className={styles.model}>
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
        dispatch(setservice(event.target.id))
        router.push(`/masternear/${event.target.id}`)
    }
    return (
        <>
            <Header sel="/catalog" />
            <div className={styles.selector}>
                <span onClick={() => setSelector(true)} style={selector ? sel : null}>Каталог услуг</span>
                <span onClick={() => setSelector(false)} style={selector ? null : sel}>Мероприятия</span>
            </div>
            {selector ? <div className={styles.images} onClick={ToService}>
                {images.map(i =>
                    <Image key={i} id={i} alt="image" src={'/' + i + '.svg'} width="100" height='120' />

                )}
            </div>
                :
            <My_Events />
            }

        </>
    )

}  