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
    fontWeight: 600

}

const Master = () => {
    const [viewText, setViewText] = useState(true)
    const [nav_view, setNavView] = useState('Лента')
    const [profile, setProfile] = useState(null)
   
    const router = useRouter()
    const { slug } = router.query
    const [gradient,color,background] = profile?.color || []
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

   
    return (
        <main className={styles.main}>
            <Head><title>{slug}</title></Head>
            {profile ? <>
                <Header text={slug} sel='back' color={profile?.color} />
                <section className={styles.section_main}>
                    <MasterHeader profile={profile}/>
                    <div className={styles.buttons}>
                        <Link href={my_profile.status === 'client' ? '/chat' : `/master/${slug}/error`} style={{ backgroundColor: background }} >
                            <span style={{ color: color }}>
                                Сообщения
                                <Menu_icon type="chat" color={color} />
                            </span>
                        </Link>    
                        <Link
                            href={{
                                pathname: my_profile.status === 'client' ? 
                                '/recordingtomaster' : 
                                `/master/${slug}/error`,
                                query: my_profile.status === 'client' ? { nikname: slug, name: profile.name }: null
                            }}
                            style={{ backgroundColor: background }}

                        >
                            <span style={{ color: color }}>
                                Запись к мастеру
                                <Menu_icon type="edit" color={color} />
                            </span>
                        </Link>
                    </div>
                    <nav className={styles.navigation}>
                        {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                            .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? { ...active, backgroundColor: color } : null}>{i}</span>)}
                    </nav>
                    {nav_view === 'Отзывы' ? <Reviews nikname={slug} color={profile.color} /> : null}
                    {nav_view === 'Услуги' ? <Services name={slug} color={profile.color} /> : null}
                    {nav_view === 'Лента'  ? <Lenta nikname={slug} color={profile.color} /> : null}
                    {nav_view === 'Сертификаты' ? <Sertificats nikname={slug} /> : null}
                    
                </section>
                <Navi color={gradient} />
            </> :
                <div className={styles.await}>
                    <Image alt="await" src='/await.gif' width={150} height={150} />
                </div>}
        </main>
    )

}

export default Master