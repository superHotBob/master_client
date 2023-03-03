import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import logo from '../../../public/logo.svg'
import menu from '../../../public/sort.svg'
import arrow from '../../../public/arrow_back.svg'



export default function Header({ sel, text }) {
  return (
    <header className={styles.header}>
      {sel ? <Link href={sel} className={styles.arrow} style={{ float: 'left' }}>
        <Image alt="Picture of the author" src={arrow} className={styles.arrow} width={20} height={20} />
      </Link> : null}
      {text ? <span style={{ color: "#000" }}>{text}</span> : <><Image alt="Picture of the author" src={logo} width={36} height={40} style={{ background: 'none' }} />
        <span>masters.</span><span>place</span></>}
      <Link href='/' className={styles.left__arrow}>
        <Image alt="menu" src={menu} className={styles.left__arrow} width={20} height={20} />
      </Link>
    </header>
  )
}