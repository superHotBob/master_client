import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Message from '@/components/message'


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
    console.log(profile)
    const [nav_view, setNavView] = useState('Лента')
    useEffect(() => profile.status === 'master' ? console.log('Bob') : () => router.push('/enter'), [])
    return (
        <main className={styles.main}>
            <Head>
                <title>{pid}</title>
            </Head>
            <Header text={pid} />
            <div
                className={styles.profile}
                style={{ backgroundImage: profile.image ?  'url('+ profile.image +')' : null }}
            >
                {profile.name}
                <Link href="/editprofile">{profile.text || 'Написать о себе'}</Link>
            </div>
            <nav className={styles.navigation}>
                {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                    .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
            </nav>

            <section className={styles.lenta}>

                {nav_view === 'Отзывы' ? <>
                   <Message text={`Здесь будут отображаться отзывы на выполенные
                        вами заказы и проведенные мероприятия.`}/>
                   
                </> : null}
                {nav_view === 'Услуги' ? <>
                    <Message text={`Здесь будут отображаться ваши слуги  прайс лиcт 
                    по категориям. Вы сможете редактировать его в
                    любое время, дополняя и редактируя его.`} />
                    <Link href="/masternear" className={styles.uslugi}>
                        Добавить услугу
                    </Link>
                </> : null}

                {nav_view === 'Лента' ? <>
                    <Message text={`Здесь будут фотографии ваших работ, которые 
                    будут видны клиентам и другим мастерам. Они
                    смогут их сохранять в закладки, что бы не
                    потерять вас из виду.
            `} />

                    <Link href="/masternear" className={styles.uslugi}>
                        Добавить публикацию
                    </Link>
                </> : null}
                {nav_view === 'Сертификаты' ? <>
                    <Message text={`Расскажите о своем профессиональном опыте,
                        продемонстрируйте всем свое мастеркство и
                        продтвердите это сертификатами.                    
                    `} />
                    <Link href="/masternear" className={styles.uslugi}>
                        Добавить сетрификат
                    </Link>
                </> : null}
            </section>
        </main >
    )
}