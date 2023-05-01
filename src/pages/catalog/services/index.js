import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './services.module.css'
import { useDispatch } from 'react-redux'
import { setservice } from '@/reduser'
import { useRouter } from 'next/router'

const images = ['маникюр', 'педикюр', 'макияж', 'ресницы','брови', 'депиляция', 'массаж', 'стрижка', 'окрашивание', 'прически', 'барбер','чистка']

const events = [
    { text: '', link: '/', image: '/image/event1.jpg' },
    { text: '', link: '/', image: '/image/event2.jpg' }
]
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}
export default function Services() {
    const [selector, setSelector] = useState(1)
    const dispatch = useDispatch()
    const router = useRouter()
    function ToService(a) {
        dispatch(setservice(a))
        router.push("/masternear?sel=list")
    }
    return (
        <>
            <Header sel="/catalog" />
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Каталог услуг</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>Мероприятия</span>
            </div>
            {selector ? <div className={styles.images}>
                {images.map(i =>                   
                    <Image key={i} onClick={()=>ToService(i)} alt="image" src={'/' + i + '.svg'} width="100" height='120' />
                   
                )}
            </div> : <div className={styles.events}>
                <Link href="/event" className={styles.model}>
                    СТАТЬ МОДЕЛЬЮ <br />БЕСПЛАТНО
                </Link>
                {events.map(i => <Link href={i.link} key={i.image} style={{ backgroundImage: "url(" + i.image + ")" }} >{i.text}</Link>)}


            </div>}
            {/* <Navi page="catalog" /> */}
        </>
    )

}  