import Image from 'next/image'
import Link from 'next/link'
import styles from './navi.module.css'
import dashboard from '../../../public/dashboard_w.svg'
import home from '../../../public/home_bl.svg'

export default function Navi(props) {
    return (
        <div className={styles.main}>
            <Link href="/" className={styles.home}>
                <Image src={home} height={20} width={20} />
            </Link>
            <Link href="/" className={styles.dashboard}>
                <Image src={dashboard} height={20} width={20} />
            </Link>
            <Link href="/" className={styles.enter}>
                Вход                
            </Link>

        </div>
    )
}