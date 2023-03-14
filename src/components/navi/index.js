import Image from 'next/image'
import Link from 'next/link'
import styles from './navi.module.css'
import dashboard from '../../../public/dashboard_w.svg'
import dashboard_bl from '../../../public/dashboard_bl.svg'
import home from '../../../public/home_bl.svg'
import home_wh from '../../../public/home_wh.svg'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


const active = {
    backgroundColor: '#fff',
    backgroundImage: 'url("/profile_blue.svg")',
    width: '46px',
    backgroundPosition: 'center',
    fontSize: 0
}
const saved = {
    backgroundColor: '#fff',
    backgroundImage: 'url("/bookmark_bl.svg")',
    width: '46px',
    backgroundPosition: 'center',
}

export default function Navi({page,save}) {
    const [height, setHeight] = useState(0)   
    const prof = useSelector(state=>state.counter.profile)   
    useEffect(() => setHeight(window.innerHeight),[])
    return (
        <div className={styles.total} style={{top: (height - 70) + 'px'}}>
        <div className={styles.main}>
            <Link href="/" className={page === 'home' ? styles.home: styles.dashboard}>
                <Image alt="home" src={page === 'home' ? home : home_wh} height={20} width={20} />
            </Link>
            <Link href="/catalog" className={page === 'catalog' ? styles.home : styles.dashboard }>
                <Image alt="catalog" src={page === 'catalog' ? dashboard_bl: dashboard} height={20} width={20} />
            </Link>
            {prof.status ? <>
            <Link href="/enter" className={styles.message} />            
            <Link href={'/savedworks/' + prof.nikname} className={styles.stroke}  style={save ? saved: null}/>  
            </>: null}         
            <Link href="/enter" disabled className={styles.enter} style={prof.status ? active : null}>
                Вход                
            </Link>
        </div>
        </div>
    )
}