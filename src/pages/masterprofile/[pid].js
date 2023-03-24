import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Message from '@/components/message'
import Navi from '@/components/navi'


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
    const [nav_active, setNavActive] = useState()
    const [one, two, three] = profile.color

    useEffect(() => profile.status === 'master' ? setNavActive({
        backgroundColor: two,
        color: "#fff",
        padding: '0 20px',
        fontWeight: 600
    }) : () => router.push('/enter'), [two, router,profile.status])
    return (
        <main className={styles.main}>
            <Head>
                <title>{pid}</title>
            </Head>
            <Header text={pid} color={profile.color} />
            <div
                className={styles.profile}
                style={{ backgroundImage: profile.image ? 'url(' + profile.image + ')' : null }}
            >
                {profile.name}
                <Link href="/editprofile" style={{color: two}}>{profile.text || 'Написать о себе'}</Link>
            </div>
            <nav className={styles.navigation}>
                {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                    .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
            </nav>

            <section className={styles.lenta}>

                {nav_view === 'Отзывы' ? <>
                    <Message color={profile.color} text={`Здесь будут отображаться отзывы на выполенные
                        вами заказы и проведенные мероприятия.`} />

                </> : null}
                {nav_view === 'Услуги' ? <>
                    <Message color={profile.color} text={`Здесь будут отображаться ваши слуги  прайс лиcт 
                    по категориям. Вы сможете редактировать его в
                    любое время, дополняя и редактируя его.`} />
                    <Link href="/addservice" className={styles.uslugi} style={{backgroundColor: two }}>
                        <span style={{ color: '#fff'}}> Добавить услугу</span>
                    </Link>
                </> : null}

                {nav_view === 'Лента' ? <>
                    <Message color={profile.color} text={`Здесь будут фотографии ваших работ, которые 
                    будут видны клиентам и другим мастерам. Они
                    смогут их сохранять в закладки, что бы не
                    потерять вас из виду.
            `} />

                    <Link
                        href="/masternear"
                        className={styles.uslugi}
                        style={{ color: '#fff', backgroundColor: two }}
                    >
                        <span style={{ color: '#fff'}}>Добавить публикацию</span>
                    </Link>
                </> : null}
                {nav_view === 'Сертификаты' ? <>
                    <Message color={profile.color} text={`Расскажите о своем профессиональном опыте,
                        продемонстрируйте всем свое мастеркство и
                        продтвердите это сертификатами.                    
                    `} />
                    <Link href="/masternear" className={styles.uslugi} style={{ color: '#fff', backgroundColor: two }}>
                    <span style={{ color: '#fff'}}>Добавить сетрификат</span>
                    </Link>
                </> : null}
            </section>
            <Navi color={two} />
        </main >
    )
}