import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import logo from '../../../public/logo.svg'
import close from '../../../public/close_wh.svg'
import img_menu from '../../../public/sort.svg'
import arrow from '../../../public/arrow_back.svg'
import { useSelector } from 'react-redux'
import Menu from '../menu'
import { useState } from 'react'

const new_text = {
  color: '#000',
  font: '500 16px/26px Rubik, sans-serif',
  display: 'inline-block',
  fontWeight: 'bold',
}
const close_menu = {
  backgroundColor: '#3D4EEA'
}

export default function Header({ sel, text }) {
  const master = useSelector((state) => state.counter.master)
  const [menu, menuView] = useState(false)
  return (
    <header className={styles.header}>
      {sel ? <Link href={sel} className={styles.arrow} style={{ float: 'left' }}>
        <Image alt="Picture of the author" src={arrow} className={styles.arrow} width={20} height={20} />
      </Link> : null}
      {text ? <h3 style={new_text}>{text}</h3> : <><Image className={styles.icon} alt="Picture of the author" src={logo} width={36} height={30} style={{ background: 'none' }} />
        <h3>masters.</h3><h3>place</h3></>}


      <Image
        src={menu ? close : img_menu}
        alt="menu"
        onClick={() => menuView(!menu)}
        className={styles.left__arrow}
        width={20} height={20}
        style={menu ? close_menu : null}
      />

      {menu ? <Menu /> : null}
    </header>
  )
}