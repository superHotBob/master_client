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



const Master = () => {
    const [viewText, setViewText] = useState(true)
    const [nav_view, setNavView] = useState('Лента')
    const [profile, setProfile] = useState({ color: ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD'] })
    const [nav_active, setNav_active] = useState({})
    const router = useRouter()
    const { pid } = router.query
    const my_profile = useSelector(state => state.counter.profile)




    useEffect(() => {
        async function GetMaster() {
            const response = await fetch(`/api/master?nikname=${pid}`, {

                headers: {
                    'Content-Type': 'application/json',
                },
                // The method is POST because we are sending data.
                method: 'get',
            })

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()
            setProfile(result[0])
            console.log('This is result', result[0])
            setNav_active({
                backgroundColor: result[0].color[1],
                color: "#fff",
                padding: '0 20px',
                fontWeight: 600
            })
        }
        let local_profile = localStorage.getItem(profile);
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
            <Header text={pid} sel="/masternear" color={profile.color} />

            <section className={styles.section}>
                <div className={styles.image} style={{ background: profile.color[0] }}>
                    {profile.image ? <Image src={profile.image} alt="profile" height={105} width={105} /> : null}
                </div>
                <p>
                    <span style={{width: 'fit-content'}}>{profile.name}</span>
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
                    <button style={{ backgroundColor: profile.color[2]}} onClick={() => EnterToMessanger(1)}>
                        <span style={{color: profile.color[1]}}>
                            Сообщения
                            <Menu_icon type="chat" color={profile.color[1]} />
                        </span>
                    </button>
                    <button style={{ backgroundColor: profile.color[2]}} onClick={() => EnterToMessanger(0)}>
                        <span style={{color: profile.color[1]}}>
                            Запись к мастеру
                            <Menu_icon type="edit" color={profile.color[1]} />
                        </span>
                    </button>
                </div>
                <nav className={styles.navigation}>
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? nav_active : null}>{i}</span>)}
                </nav>
            </section>
            {nav_view === 'Отзывы' ? <Reviews name={pid} /> : null}
            {nav_view === 'Услуги' ? <Services name={pid} /> : null}
            {nav_view === 'Лента' ? <Lenta name={pid} color={profile?.color} /> : null}
            {nav_view === 'Сертификаты' ? <Sertificats name={pid} /> : null}
            <Navi color={profile.color[0]}/>
        </main>
    )

}

export default Master