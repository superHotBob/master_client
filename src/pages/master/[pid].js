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
import Location from '@/components/location'

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
    const [mapview, setmapview] = useState(false)
    const router = useRouter()
    const { pid } = router.query
    
    const my_profile = useSelector(state => state.counter.profile)
    

    useEffect(() => {
        let local_profile = localStorage.getItem('profile')        
        async function GetMaster() {
            const response = await fetch(`/api/master?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },                
                method: 'get',
            })           
            const result = await response.json()           
            setProfile(result[0])
          
        }
        // if (local_profile) {
        //     setProfile(my_profile);
        // } else {
            GetMaster()
        // }


    },[])

    function EnterToMessanger(a) {
        if (profile.status==='client') {
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
                <Header text={pid} sel='back' color={profile.color} />
                {mapview ? 
                <Location  loc_master={profile.locations} close={setmapview}/>
                :
                <section className={styles.section}>
                    <div className={styles.image} style={{ background: profile.color[0] }}>
                        {profile.image ? <Image src={url + 'var/data/' + pid + '/main.jpg'} alt="profile img" height={105} width={105} /> : null}
                    </div>
                    <p className={styles.name_stars}>
                        <span style={{ width: 'fit-content' }}>{profile.name}</span>
                        <span className={styles.pro} style={{ background: profile.color[0] }}>MASTER</span>
                        {profile.stars?<span
                            className={styles.stars}
                            style={{ color: profile.color[1], backgroundColor: profile.color[2] }}
                        >4.7</span>:null}
                    </p>
                    <h4 onClick={()=>setmapview(true)}>{profile.address}</h4>
                    {viewText ? <h5 className={styles.text}>{profile.text}</h5> : null}
                    <span style={{ color: profile.color[1] }} className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
                    <div className={styles.buttons}>
                        <Link href={my_profile.status === 'client' ? '/chat' : '/error'} style={{ backgroundColor: profile.color[2] }} >
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
                            .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? {...active,backgroundColor: profile.color[1]} : null}>{i}</span>)}
                    </nav>
                    {nav_view === 'Отзывы' ? <Reviews nikname={profile.nikname} color={profile.color} /> : null}
                    {nav_view === 'Услуги' ? <Services name={pid} color={profile.color} /> : null}
                    {nav_view === 'Лента' ? <Lenta nikname={pid} color={profile.color} /> : null}
                    {nav_view === 'Сертификаты' ? <Sertificats nikname={pid} /> : null}
                    
                </section>}               
                <Navi color={profile.color[0]} />
                </> :
                <div className={styles.await}>
                    <Image alt="await" src='/await.gif' width={150} height={150} />
                </div>}
        </main>
    )

}

export default Master