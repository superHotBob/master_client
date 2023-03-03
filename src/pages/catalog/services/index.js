import Header from '@/components/header'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './services.module.css'

const images = ['manicur', 'pedicur', 'makiash', 'resnici', 'chistka',
    'brovi', 'depil', 'massage', 'strishka', 'colored', 'pricheska', 'barber']

const events = [
    { text: '', link: '/', image: '/image/event1.jpg' },
    { text: '', link: '/', image: '/image/event2.jpg' }
]
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',

    color: '#fff'
}
export default function Services() {
    const [selector, setSelector] = useState(1)
    return (
        <div className={styles.main}>
            <Header sel="/catalog" />
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Каталог услуг</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>Мероприятия</span>
            </div>
            {selector ? <div className={styles.images}>
                {images.map(i =>
                    <Link href={'/catalog/service/' + i} key={i}>
                        <Image alt="image" src={'/' + i + '.svg'} width="100" height='120' />
                    </Link>
                )}
            </div> : <div className={styles.events}>
                <Link href="/event" className={styles.model}>
                    <Image alt="master" src="/image/model.jpg" fill />
                </Link>
                {events.map(i => <Link href={i.link} key={i.image} style={{ backgroundImage: "url(" + i.image + ")" }} >{i.text}</Link>)}


            </div>}
            <Navi page="catalog" />
        </div>
    )

}  