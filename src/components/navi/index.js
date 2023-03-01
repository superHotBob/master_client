import Image from 'next/image'
import Link from 'next/link'
import styles from './navi.module.css'
import dashboard from '../../../public/dashboard_w.svg'
import dashboard_bl from '../../../public/dashboard_bl.svg'
import home from '../../../public/home_bl.svg'
import home_wh from '../../../public/home_wh.svg'

export default function Navi({page}) {
    return (
        <div className={styles.main}>
            <Link href="/" className={page === 'home' ? styles.home: styles.dashboard}>
                <Image alt="home" src={page === 'home' ? home : home_wh} height={20} width={20} />
            </Link>
            <Link href="/catalog" className={page === 'catalog' ? styles.home : styles.dashboard }>
                <Image alt="catalog" src={page === 'catalog' ? dashboard_bl: dashboard} height={20} width={20} />
            </Link>
            <Link href="/" className={styles.enter}>
                Вход                
            </Link>

        </div>
    )
}