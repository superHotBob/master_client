import { useRouter } from 'next/router'
import styles from './master.module.css'
import Image from 'next/image'
import stroke from '../../../public/stroke.svg'
import sort from '../../../public/sort.svg'
import Link from 'next/link'
import Header from '@/components/header'
import { useState } from 'react'
import Navi from '@/components/navi'
import Reviews from '@/components/reviews'

const nav_active = {
    backgroundColor: '#3D4EEA',
    color: "#fff",
    padding: '0 20px',
    fontWeight: 600
}

const Master = () => {
    const [viewText, setViewText] = useState(true)
    const [nav_view, setNavView] = useState('Лента')
    const router = useRouter()
    const { pid } = router.query
    return (
        <div className={styles.main}>
            <Header text={pid} sel="/masternear" />
            <section className={styles.section}>
                <div className={styles.image}>
                    <Image src='/image/profile1.jpg' alt="profile" height={105} width={105} />
                </div>
                <p>
                    <b>{pid}</b>
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                {viewText ? <span className={styles.text}>Мастер миникюра с 2022 года. Обучалась в УЦ Оле Хаус,
                    Пластек, Beautix, Luxio. Прошла курсы. Мастер
                    миникюра с 2022 года.
                    Обучалась в УЦ Оле Хаус, Пластек,
                    Beautix, Luxio. Прошла курсы
                </span> : null}
                <span className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
                <div className={styles.buttons}>
                    <button>Сообщения</button>
                    <button>Запись к мастеру</button>
                </div>
                <nav className={styles.navigation}>
                    {['Лента','Услуги','Сертификаты','Отзывы']
                    .map(i=><span key={i} onClick={()=>setNavView(i)} style={nav_view === i ? nav_active:null}>{i}</span>)}
                </nav>
            </section>
            <main>
               {nav_view === 'Отзывы' ? <Reviews name={pid} /> : null}
            </main>
            <Navi page="master"/>

        </div>
    )

}

export default Master