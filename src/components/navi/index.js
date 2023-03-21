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

export default function Navi({save}) {
    const [height, setHeight] = useState(0)   
    const prof = useSelector(state=>state.counter.profile)  
    const router= useRouter()   
    useEffect(() => setHeight(window.innerHeight),[])
    return (
        <div className={styles.total} style={{top: (height - 70) + 'px'}}>
        <div className={styles.main}>
            <Link href="/" className={router.asPath === '/' ? styles.home: styles.dashboard}>
                <Image alt="home" src={router.asPath === '/' ? home : home_wh} height={20} width={20} />
            </Link>
            <Link href="/catalog" className={router.asPath.includes('catalog') ? styles.home : styles.dashboard }>
                <Image alt="catalog" src={router.asPath.includes('catalog') ? dashboard_bl: dashboard} height={20} width={20} />
            </Link>
            {prof.status ? <>
            <Link href="/chat" className={styles.message} />            
            <Link 
                href={prof.status==='client' ? '/client/' + prof.nikname : '/savedworks/' + prof.nikname} 
                className={styles.stroke}  
                style={router.asPath.includes('save') ? saved: null}
            />  
            </>: null}         
            <Link 
                href={prof.status ? "/" + prof.status + "/" + prof.nikname : "/enter"} 
                className={styles.enter} 
                style={ prof.status ? 
                    (router.asPath.includes('client') || router.asPath.includes('master') ? active : active_two) : null }
            >
                Вход                
            </Link>
        </div>
        </div>
    )
}