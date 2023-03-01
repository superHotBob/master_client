import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import logo from '../../../public/logo.svg'
import menu from '../../../public/sort.svg'



export default function Header() {
    return (
        <main className={styles.main}>
        <header className={styles.header}>
          <Image alt="Picture of the author" src={logo} width={36} height={40} style={{ background: 'none' }} />
          <span>masters.</span><span>place</span>
          <Link href='/' className={styles.left__arrow}>
            <Image alt="Picture of the author" src={menu} className={styles.left__arrow} width={20} height={20} />
          </Link>
        </header>
        </main>
    )
}