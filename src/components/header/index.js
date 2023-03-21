import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import call from '../../../public/call.svg'
import close from '../../../public/close_wh.svg'
import img_menu from '../../../public/sort.svg'
import arrow from '../../../public/arrow_back.svg'
import { useSelector, useDispatch } from 'react-redux'
import Menu from '../menu'
import { useState, useEffect } from 'react'
import { setprofile } from '@/reduser'


const new_text = {
  color: '#000',
  font: '500 16px/26px Rubik, sans-serif',
  display: 'inline-block',
  fontWeight: 'bold',
}
const new_text_mes = {
  color: '#000',
  font: '500 16px/26px Rubik, sans-serif',
  display: 'inline-block',
  fontWeight: 'bold',
  marginLeft: '-35px' 
}
const close_menu = {
  backgroundColor: '#3D4EEA'
}

export default function Header({ sel, text, mes }) {
  const profile = useSelector((state) => state.counter.profile)
  const dispatch = useDispatch()
  useEffect(() => {   
    let pro = JSON.parse(localStorage.getItem("profile"))
    if (!profile.status) {
      dispatch(setprofile(pro))
    }
  }, [profile.status,dispatch])
  const [menu, menuView] = useState(false)
  return (
    <header className={styles.header}>
      {sel ? <Link href={sel} className={styles.arrow} style={{ float: 'left' }}>
        <Image alt="Picture" src={arrow} className={styles.arrow} width={20} height={20} />
      </Link> :
        <Image alt="Picture" src={arrow} className={styles.arrow} style={{ opacity: 0 }} width={20} height={20} />

      }


      {text ?
        <h3 style={mes ? new_text_mes : new_text}>
          {mes ? <Image
            src="/image/redbull.jpg"
            alt="menu"           
            className={styles.image_master}
            width={39} height={40}
          /> : null}

          {text}
        </h3>
        : <div className={styles.logo}>
          {/* <Image className={styles.icon} alt="Picture" src={logo} width={36} height={30} style={{ background: 'none' }} /> */}
          <h3>masters.</h3>
          <h3>place</h3>
        </div>
      }

      {mes ? <Image
        src={call}
        alt="menu"
        style={{ transform: 'transitionX(20px)' }}
        className={styles.call}
        width={20} height={20}
      /> : null}

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