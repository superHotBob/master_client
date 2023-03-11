import { useRouter } from 'next/router'
import styles from './master.module.css'
import Image from 'next/image'
import Header from '@/components/header'
import { useState } from 'react'
import Navi from '@/components/navi'
import Reviews from '@/components/reviews'
import Services from '@/components/services'
import Lenta from '@/components/lenta'
import Sertificats from '@/components/serificats'

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
                    {pid}
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                <h4>Метро Красный октябрь</h4>
                {viewText ? <h5 className={styles.text}>Мастер миникюра с 2022 года. Обучалась в УЦ Оле Хаус,
                    Пластек, Beautix, Luxio. Прошла курсы. Мастер
                    миникюра с 2022 года.
                    Обучалась в УЦ Оле Хаус, Пластек,
                    Beautix, Luxio. Прошла курсы
                </h5> : null}
                <span className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
                <div className={styles.buttons}>
                    <button><span>Сообщения</span></button>
                    <button><span>Запись к мастеру</span></button>
                </div>
               
                <nav className={styles.navigation}>
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
                </nav>
            </section>
            {nav_view === 'Отзывы' ? <Reviews name={pid} /> : null}
            {nav_view === 'Услуги' ? <Services name={pid} /> : null}
            {nav_view === 'Лента' ? <Lenta name={pid} /> : null}
            {nav_view === 'Сертификаты' ? <Sertificats name={pid} /> : null}
            <Navi page="master" />
        </div>
    )

}

export default Master