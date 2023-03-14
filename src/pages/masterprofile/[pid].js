import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Navi from '@/components/navi'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect,  useState } from 'react'


const nav_active = {
    backgroundColor: '#3D4EEA',
    color: "#fff",
    padding: '0 20px',
    fontWeight: 600
}
export default function Client() {
    const router = useRouter()
    const { pid } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [nav_view, setNavView] = useState('Лента')
    useEffect(() => profile.status === 'master' ? console.log('Bob') : () => router.push('/enter'), [])
    return (
        <main className={styles.main}>
             <Head>
                <title>{pid}</title>
            </Head>
            <Header text={pid} />
            <div className={styles.profile} style={{ backgroundImage: "url(/camera_bl.svg" }}>
                {profile.username}
                <Link href="/editprofile">Написать о себе</Link>
            </div>
            <nav className={styles.navigation}>
                {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                    .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
            </nav>



            {nav_view === 'Отзывы' ? <>
                <div className={styles.message} >
                    Здесь будут отображаться отзывы на выполенные<br />
                    вами заказы и проведенные мероприятия.
                </div>
            </> : null}
            {nav_view === 'Услуги' ? <>
                <div className={styles.message} >
                Здесь будут отображаться ваши слуги / прайс лиcт <br/>
                по категориям. Вы сможете редактировать его в<br/>
                любое время, дополняя и редактируя его.
                </div>
                <Link href="/masternear" className={styles.uslugi}>
                    Добавить услугу
                </Link>

            </> : null}

            {nav_view === 'Лента' ? <>
                <div className={styles.message}>
                    Здесь будут фотографии ваших работ, которые <br />
                    будут видны клиентам и другим мастерам. Они <br />
                    смогут их сохранять в закладки, что бы не<br />
                    потерять вас из виду.
                </div>
                <Link href="/masternear" className={styles.uslugi}>
                    Добавить публикацию
                </Link>
            </> : null}
            {nav_view === 'Сертификаты' ? <>
                <div className={styles.message}>
                    Расскажите о своем профессиональном опыте,<br />
                    продемонстрируйте всем свое мастеркство и<br />
                    продтвердите это сертификатами.
                </div>
                <Link href="/masternear" className={styles.uslugi}>
                    Добавить сетрификат
                </Link>
            </> : null}
            <Navi page={pid} />

        </main >
    )
}