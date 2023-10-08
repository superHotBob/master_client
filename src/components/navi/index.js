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
    const prof = useSelector(state => state.counter.profile)
    const tema = useSelector(state => state.counter.tema)
    const router = useRouter()
    const pathname = usePathname()  
    
   
    useEffect(() => setHeight(window.innerHeight - 70 + 'px'), [])
    
    return (        
        <div className={styles.total} style={{ top: height }}>
            <div className={styles.main_navi} style={{ backgroundColor: tema[1],backgroundSize: '200%'}}>
                <Link title='на главную страницу' href="/" className={pathname === '/' ? styles.home : styles.dashboard}>
                    <Image alt="home" src={pathname === '/' ? home : home_wh} height={20} width={20} />
                </Link>
                <Link title="в каталог" href="/catalog" className={pathname === '/catalog' ? styles.home : styles.dashboard}>
                    <Image alt="catalog" src={pathname === '/catalog' ? dashboard_bl : dashboard} height={20} width={20} />
                </Link>
                {prof.status ? 
                    <Link 
                        href="/chat" 
                        title="в чат" 
                        className={styles.message} 
                        style={pathname === '/chat' ?  chat : null}
                    /> : 
                null}
                {prof.status === 'client' ?
                    <Link
                        href={'/clientprofile/' + prof.nikname }
                        title="сохранённое"
                        className={styles.stroke}
                        style={(router.asPath.includes('orders') || !router.asPath.includes(prof.nikname)) ? null : saved}
                    />: null}
                <Link
                    href={prof.status ? "/" + prof.status + "profile/" + prof.nikname : "/enter"}
                    title="в профиль"
                    className={styles.enter}
                    style={prof.status ?
                        (router.asPath.includes('clientprofile') || router.asPath.includes('masterprofile/') ? active : active_two) : null}
                >
                    Вход
                </Link>
            </div>
        </div>
    )
}