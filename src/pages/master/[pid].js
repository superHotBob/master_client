import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from './master.module.css'
import Image from 'next/image'
import Header from '@/components/header'
import { useEffect, useState } from 'react'
import Navi from '@/components/navi'
import Reviews from '@/components/reviews'
import Services from '@/components/services'
import Lenta from '@/components/lenta'
import Sertificats from '@/components/serificats'
import { useSelector } from 'react-redux'
import Menu_icon from '@/components/icons/menu'
import Link from 'next/link'

const Master = () => {
    const [viewText, setViewText] = useState(true)
    const [nav_view, setNavView] = useState('Лента')
    const [profile, setProfile] = useState(null)
    const [nav_active, setNav_active] = useState({})
    const router = useRouter()
    const { pid } = router.query
    const my_profile = useSelector(state => state.counter.profile)
    

    useEffect(() => {
        let local_profile = localStorage.getItem(profile);
        async function GetMaster() {
            const response = await fetch(`/api/master?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },                
                method: 'get',
            })           
            const result = await response.json()
            setProfile(result[0])
            setNav_active({
                backgroundColor: result[0].color[1],
                color: "#fff",
                padding: '0 20px',
                fontWeight: 600
            })
        }

        if (local_profile) {
            setProfile(my_profile);
        } else {
            GetMaster()

        }


    }, [pid])

    function EnterToMessanger(a) {
        if (profile.status) {
            router.push('/chat')
        } else {
            router.push('/error')
        }
    }
    return (
        <main className={styles.main}>
            <Head>
                <title>{pid}</title>
            </Head>
            {profile ? <>
                <Header text={pid} sel="/masternear" color={profile.color} />

                <section className={styles.section}>
                    <div className={styles.image} style={{ background: profile.color[1] }}>
                        {profile.image ? <Image src={profile.image} alt="profile" height={105} width={105} /> : null}
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
                    <div className={styles.buttons}>
                        <Link href="/#" style={{ backgroundColor: profile.color[2] }} onClick={() => EnterToMessanger(1)}>
                            <span style={{ color: profile.color[1] }}>
                                Сообщения
                                <Menu_icon type="chat" color={profile.color[1]} />
                            </span>
                        </Link>
                        <Link 
                             href={{
                                pathname: my_profile.status === 'client' ? '/recordingtomaster' : '/error',
                                query: { nikname: pid, name: profile.name },
                              }}
                            style={{ backgroundColor: profile.color[2] }} 
                            
                        >
                            <span style={{ color: profile.color[1] }}>
                                Запись к мастеру
                                <Menu_icon type="edit" color={profile.color[1]} />
                            </span>
                        </Link>
                    </div>
                    <nav className={styles.navigation}>
                        {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                            .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
                    </nav>
                    {nav_view === 'Отзывы' ? <Reviews name={pid} /> : null}
                    {nav_view === 'Услуги' ? <Services name={pid} color={profile.color} /> : null}
                    {nav_view === 'Лента' ? <Lenta name={pid} color={profile?.color} /> : null}
                    {nav_view === 'Сертификаты' ? <Sertificats name={pid} /> : null}
                </section>
                <Navi color={profile.color[1]} /></> :
                <div className={styles.await}>
                    <Image alt="await" src='/await.gif' width={150} height={150} />
                </div>}
        </main>
    )

}

export default Master