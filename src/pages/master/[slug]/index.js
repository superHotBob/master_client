import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import Head from 'next/head'
import styles from './master.module.css'
import Image from 'next/image'
import Header from '@/components/header'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setmaster } from '@/reduser'
import Navi from '@/components/navi'
import Reviews from '@/components/reviews'
import Services from '@/components/services'
import Lenta from '@/components/lenta'
import Sertificats from '@/components/serificats'
import { useSelector } from 'react-redux'
import Menu_icon from '@/components/icons/menu'
import Link from 'next/link'
import Location from '@/components/location'
import MasterHeader from '@/components/masterheader'


const url = 'https://masters-client.onrender.com/'

const active = {
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500

}

const Master = () => {
    const [message, setmessage] = useState(false)
    const [nav_view, setNavView] = useState(0)
    const [profile, setProfile] = useState(null)

    const router = useRouter()
    const { slug } = router.query
    const [gradient, color, background] = profile?.color || []
    const dispatch = useDispatch()
    const my_profile = useSelector(state => state.counter.profile)
    const master = useSelector(state => state.counter.master)


    useEffect(() => {
        const { pathname } = window.location
        if (master) {
            setProfile(master[0])
        } else {
            fetch(`/api/master?nikname=${pathname.replace('/master/', '')}`)
                .then(res => res.json())
                .then(res => setProfile(res[0]))
        }
        return () => dispatch(setmaster(''))
    }, [])

    function LinkTo(a) {
        if(my_profile.status === 'client') {
            router.push(a)
        } else {
            setmessage(true)
        }
    }
    return (
        <main className={styles.main}>
            <Head><title>{slug}</title></Head>
            {profile ? <>
                <Header text={slug} sel='back' color={profile.color} />
                <section className={styles.section_main}>
                    <MasterHeader profile={profile} />
                    <dialog open={message} className={styles.dialog}>
                        <div>
                            <span onClick={() => setmessage(false)}>закрыть</span>
                            <h4>
                                Эта функция доступна только<br />
                                зарегистрированным пользователям. Для<br />
                                продолжения войдите или зарегистрируйте<br />
                                аккаунт.
                            </h4>
                            <Link href="/enter">Войти</Link>
                        </div>
                    </dialog>
                    <div className={styles.buttons}>
                        <div onClick={()=>LinkTo(`/chat/messages/${slug}?name=${profile.name}`)} style={{ backgroundColor: background }} >
                            <span style={{ color: color }}>
                                Сообщения
                                <Menu_icon type="chat" color={color} />
                            </span>
                        </div>
                        <div onClick={()=>LinkTo(`/recordingtomaster?nikname=${slug}&name=${profile.name}`)}                           
                            style={{ backgroundColor: background }}
                        >
                            <span style={{ color: color }}>
                                Запись к мастеру
                                <Menu_icon type="edit" color={color} />
                            </span>
                        </div>
                    </div>
                    <nav className={styles.navigation}>
                        {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                            .map((i, index) => <span key={i} onClick={() => setNavView(index)} style={nav_view === index ? { ...active, backgroundColor: color } : null}>{i}</span>)}
                    </nav>
                    {nav_view === 3 ? <Reviews nikname={slug} color={profile.color} /> : null}
                    {nav_view === 1 ? <Services name={slug} color={profile.color} /> : null}
                    {nav_view === 0 ? <Lenta nikname={slug} color={profile.color} /> : null}
                    {nav_view === 2 ? <Sertificats nikname={slug} /> : null}
                </section>
                <Navi color={gradient} />
            </> :
                <div className={styles.await}>
                    <Image alt="await" src='/await.gif' width={150} height={150} />
                </div>
            }
        </main>
    )

}

export default Master