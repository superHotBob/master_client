import Image from 'next/image'
import Link from 'next/link'
import styles from './navi.module.css'
import dashboard from '../../../public/dashboard_w.svg'
import dashboard_bl from '../../../public/dashboard_bl.svg'
import home from '../../../public/home_bl.svg'
import home_wh from '../../../public/home_wh.svg'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'

const active = {
    backgroundColor: '#fff',
    backgroundImage: 'url("/profile_blue.svg")',
    width: '46px',
    fontSize: 0
}
const active_two = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backgroundImage: 'url("/profile.svg")',
    width: '46px',
    fontSize: 0
}
const saved = {
    backgroundColor: '#fff',
    backgroundImage: 'url("/bookmark_bl.svg")',
    width: '46px',
    backgroundPosition: 'center',
}
const chat = {
    backgroundColor: '#fff',
    backgroundImage: 'url("/message_active.svg")',
    width: '46px',
    backgroundPosition: 'center',
}

export default function Navi({ save, color }) {   
    const [height, setHeight] = useState('700px')
    const { profile, tema } = useSelector(state => state.counter)    
    const router = useRouter()
    const pathname = usePathname() 
  
   
    useEffect(() => setHeight(window.innerHeight - 70 + 'px'), [])

    const { data } = useSWR(profile.status  ? `
    /api/get_new_messages?nikname=${profile.nikname}&status=${profile.status}&chat=${JSON.parse(localStorage.getItem('chat'))}
    `: null)
    
    return (        
        <div className={styles.total} style={{ top: height }}>
            <div className={styles.main_navi} style={{ backgroundColor: tema[1]}}>
                <Link title='Главная страница' href="/" className={pathname === '/' ? styles.home : styles.dashboard}>
                    <Image  alt="home"  src={pathname === '/' ? home : home_wh} height={20} width={20} />
                </Link>
                <Link title="Каталог" href="/catalog" className={pathname === '/catalog' ? styles.home : styles.dashboard}>
                    <Image alt="catalog"  src={pathname === '/catalog' ? dashboard_bl : dashboard} height={20} width={20} />
                </Link>
                {profile.status ? 
                    <Link 
                        href="/chat" 
                        title="Чат" 
                        className={styles.message} 
                        style={pathname === '/chat' ?  chat : null}
                    >{data ? <span/> : null}</Link> : null
                }
                {profile.status === 'client' ?
                    <Link
                        href={'/clientprofile/' + profile.nikname  }
                        title="Сохранённые публикации"
                        className={styles.stroke}
                        style={(router.asPath.includes('orders') || !router.asPath.includes(profile.nikname)) ? null : saved}
                    /> : null
                }
                <Link
                    href={profile.status  === 'master' ? "/masterprofile/" + profile.nikname : 
                    profile.status  === 'client' ? "/clientprofile/" + profile.nikname + "/orders" :
                    "/enter"}
                    title="Мой профиль"
                    className={styles.enter}
                    style={profile.status ?
                        (router.asPath.includes('orders') || router.asPath.includes('masterprofile/') ? active : active_two) : null}
                >
                    Вход
                </Link>
            </div>
        </div>
    )
}