import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Message from '@/components/message'
import Navi from '@/components/navi'
import Services from '@/components/services'
import Image from 'next/image'
import Sertificats from '@/components/serificats'
import AddSertificat from '@/components/addsertificat'


const url = 'https://masters-client.onrender.com/var/data/'
export default function Client() {
    const router = useRouter()
    const { pid } = router.query
   
    const [profile, setProfile] = useState()
    const [nav_view, setNavView] = useState('Лента')
    const [nav_active, setNavActive] = useState()
    const [viewText, setViewText] = useState(true)
    const [newSertificat, AddNewSertificat] = useState(false)
    const [file, savefile] = useState()

    useEffect(() => {   
        let pro = JSON.parse(localStorage.getItem("profile"))    
        setProfile(profile => ({ ...profile, ...pro }))
        if (pro.status === 'master') {
            setNavActive({
                backgroundColor: pro.color[1],
                color: "#fff",
                padding: '0 20px',
                fontWeight: 600
            })
        } else {
            () => router.push('/enter')
        }
    }, [])


    
    return (
        <main className={styles.main}>
            <Head>
                <title>{pid}</title>
            </Head>
            {profile ? <>
                <Header text={pid} color={profile.color} />
                {/* <div
                    className={styles.profile}
                    style={{ backgroundImage: profile.image ? 'url(' + profile.image + ')' : null }}
                >
                    {profile.name}
                    <Link href="/editprofile" style={{ color: profile.color[1] }}>{profile.text || 'Написать о себе'}</Link>
                </div> */}
                <section className={styles.section}>
                    <div className={styles.image} style={{ background: profile.color[0] }}>
                        {profile.image ? <Image src={url + profile.nikname + '/main.jpg'} alt="profile" height={105} width={105} /> : null}
                    </div>
                    <p className={styles.name_stars}>
                        <span style={{ width: 'fit-content' }}>{profile.name}</span>
                        <span className={styles.pro} style={{ background: profile.color[0] }}>MASTER</span>
                        <span
                            className={styles.stars}
                            style={{ color: profile.color[1], backgroundColor: profile.color[2] }}
                        >4.7</span>
                    </p>
                    <h4>{profile.address}</h4>
                    {viewText ? <h5 className={styles.text}>{profile.text}</h5> : null}
                    <span style={{ color: profile.color[1] }} className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
                </section>
                <nav className={styles.navigation}>
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
                </nav>
                <section className={styles.lenta}>
                    {nav_view === 'Отзывы' ?
                        <Message color={profile.color} text={`Здесь будут отображаться отзывы на выполенные
                        вами заказы и проведенные мероприятия.`} />
                        : null}
                    {nav_view === 'Услуги' ? <>
                        <Message color={profile.color} text={`Здесь будут отображаться ваши слуги  прайс лиcт 
                            по категориям. Вы сможете редактировать его в
                            любое время, дополняя и редактируя его.`}
                        />
                        <Link href="/addservice" className={styles.uslugi} style={{ backgroundColor: profile.color[1] }}>
                            Добавить услугу +
                        </Link>
                        <Services color={profile.color} />

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
                            style={{ color: '#fff', backgroundColor: profile.color[1] }}
                        >
                            Добавить публикацию +</Link>
                    </> : null}
                    {nav_view === 'Сертификаты' ? <>
                        <Message color={profile.color} text={`Расскажите о своем профессиональном опыте,
                            продемонстрируйте всем свое мастеркство и
                            продтвердите это сертификатами.                    
                            `}
                        />
                       
                            <button onClick={()=>AddNewSertificat(true)} className={styles.uslugi} style={{ color: '#fff', backgroundColor: profile.color[1] }}>
                                Добавить сетрификат +
                            </button>
                            <Sertificats nikname={pid} />
                            {newSertificat ? <AddSertificat color={profile.color} nikname={profile.nikname} view={AddNewSertificat} /> : null}           
                            

                    </> : null}
                </section>
                <Navi color={profile.color[1]} />
            </> : null}
        </main >
    )
}