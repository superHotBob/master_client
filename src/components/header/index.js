import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'
import call from '../../../public/call.svg'
import arrow from '../../../public/arrow_back.svg'
import { useSelector, useDispatch } from 'react-redux'
import Menu from '../menu'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setprofile } from '@/reduser'
import Menu_icon from '../../components/icons/menu.js'



const new_text = {
  color: '#000',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '26px',
  display: 'inline-block',

}
const new_text_mes = {
  color: '#000',
  fontWeyght: '600',
  fontSize:  '16px',
  lineHeight: '26px',
  display: 'inline-block',
  marginLeft: '-35px'
}


export default function Header({ sel, text, mes, color = {} }) {
  const profile = useSelector((state) => state.counter.profile)
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    let pro = JSON.parse(localStorage.getItem("profile"))
    if (!profile.status) {
      dispatch(setprofile(pro))
    }
  }, [profile.status, dispatch])

  const [menu, menuView] = useState(false)

  function MenuView(e){
    e.stopPropagation()
    menuView(!menu)
  }
  function ToBack(e) {
    e.stopPropagation()
    router.back()
  }
  return (
    <header className={styles.header} onClick={MenuView}>
      {sel ? 
      <div       
        onClick={ToBack}
        className={styles.left__arrow} 
        style={{ backgroundColor: color[2],padding:'7px 2px' }}
      >
      <Menu_icon color={color[1] || '#3D4EEA'}  />
        {/* <Image alt="Picture" src={arrow} className={styles.arrow} width={20} height={20} style={{ backgroundColor: color[2] }} /> */}
      </div> :
        <Image alt="Picture" src={arrow} className={styles.arrow} style={{ opacity: 0 }} width={20} height={20} />

      }

      {text ?
        <h3 style={mes ? new_text_mes : new_text}>
          {mes ? <Image
            src={profile.image}
            alt="menu"
            className={styles.image_master}
            width={39} height={40}
          /> : null}

          {text}
        </h3>
        : <div className={styles.logo}>         
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
      {/* <Image
        src={menu ? close : img_menu}
        alt="menu"
        onClick={() => menuView(!menu)}
        className={styles.left__arrow}
        width={20} height={20}
        style={{backgroundColor: menu ? color[1] || '#3D4EEA' : color[2],}}
      /> */}
      <div
        className={styles.left__arrow}
        onClick={() => menuView(!menu)}
        style={{ backgroundColor: menu ? color[1] || '#3D4EEA' : color[2] ,paddingTop:10}}
      >
        <Menu_icon color={menu ? color[2] || '#3D4EEA' : color[1] || '#3D4EEA'} type={menu ? 'close' : 'menu'} />
      </div>
      {menu ? <Menu /> : null}
    </header>
  )
}