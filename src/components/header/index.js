import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import logo from '../../../public/logo.svg'
import menu from '../../../public/sort.svg'
import arrow from '../../../public/arrow_back.svg'

const new_text = {
  color: '#000',
  font: '500 16px/26px Rubik, sans-serif',
  display: 'inline-block',
  fontWeight: 'bold',
}

export default function Header({ sel, text }) {
  return (
    <header className={styles.header}>
      {sel ? <Link href={sel} className={styles.arrow} style={{ float: 'left' }}>
        <Image alt="Picture of the author" src={arrow} className={styles.arrow} width={20} height={20} />
      </Link> : null}
      {text ? <h3 style={new_text}>{text}</h3> : <><Image alt="Picture of the author" src={logo} width={36} height={40} style={{ background: 'none' }} />
        <h3>masters.</h3><h3>place</h3></>}
      
      <Link href='/' className={styles.left__arrow}>
        <Image alt="menu" src={menu} className={styles.left__arrow} width={20} height={20} />
      </Link>
    </header>
  )
}