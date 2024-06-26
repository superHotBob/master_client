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
const active_enter = {
    backgroundColor: '#fff',
    color: '#000'
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

export default function Navi() {   
    const [height, setHeight] = useState('1000px')
    const { profile: {nikname,status}, tema } = useSelector(state => state.counter)    
   
    const pathname = usePathname() 

   
   
   
    useEffect(() => {
        function handleResize() {           
            setHeight(window.innerHeight - 70 + 'px')
        }
        setHeight(window.innerHeight - 70 + 'px')
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const { data } = useSWR(status  ? `
    /api/get_new_messages?nikname=${nikname}&status=${status}&chat=${JSON.parse(localStorage.getItem('chat'))}
    `: null)   
    
    return (        
        <div className={styles.total} style={{ top: height }}>
            <div className={styles.main_navi} style={{ backgroundColor: tema[1]}}>
                <Link href="/" className={pathname === '/' ? styles.home : styles.dashboard}>
                    <Image title='на главную' alt="home"  src={pathname === '/' ? home : home_wh} height={20} width={20} />
                </Link>
                <Link href="/catalog" className={pathname === '/catalog' ? styles.home : styles.dashboard}>
                    <Image title='в каталог' alt="catalog"  src={pathname === '/catalog' ? dashboard_bl : dashboard} height={20} width={20} />
                </Link>
                {status ? 
                    <Link 
                        href="/chat" 
                        title="Чат" 
                        className={styles.message} 
                        style={pathname === '/chat' ?  chat : null}
                    >{data ? <span/> : null}</Link> : null
                }
                {status === 'client' ?
                    <Link
                        href={'/clientprofile/' + nikname  }
                        title="Сохранённые публикации"
                        className={styles.stroke}
                        style={(pathname.includes('orders') || !pathname.includes(nikname)) ? null : saved}
                    /> : null
                }
                {status != undefined && <Link
                    href={status  === 'master' ? "/masterprofile/" + nikname : "/clientprofile/" + nikname + "/orders" }
                    title="Мой профиль"
                    className={styles.enter}
                    style={status ?
                        (pathname.includes('orders') || pathname.includes('masterprofile/') ? active : active_two) : null}
                /> }
                { pathname === '/enter' ? 
                <span className={styles.enter} style={active_enter}>
                    Вход
                </span> 
                : <>                   
                {status === undefined && <Link
                    href="/enter"
                    title="Вход"
                    className={styles.enter}                   
                >
                    Вход
                </Link>  } </> }
            </div>
        </div>
    )
}