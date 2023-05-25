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

const url = 'https://masters-client.onrender.com/'

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
    // if (pro?.status === 'master') {
    //   async function GetMasterOrders() {
    //     const response = await fetch(`/api/get_orders_master?nikname=${pro.nikname}`, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'get',
    //     })
    //     const result = await response.json()
    //     const new_result = [...result]
    //     console.log(new_result)
    //     // let month_result = new_result.filter(i => i.date_order.includes(months[month]))
    //     // let flsd = month_result.map(i => +i.date_order.split(',')[0])
    //     // set_false_days(flsd)
    //     // setOrders(month_result)
    //   }
    //   GetMasterOrders()

    // }
  }, [profile.status, dispatch])

  const [menu, menuView] = useState(false)

  function MenuView(e){
    e.stopPropagation()
    menuView(!menu)
  }
  function ToBack(e) {
    e.stopPropagation()
    if(sel !== 'back') {
      return router.push(sel)
    }
    router.back()
  }
  return (
    <header className={styles.header} onClick={MenuView}>
      {sel ? 
        <div       
          onClick={ToBack}
          className={styles.left__arrow} 
          style={{ backgroundColor: color[2] }}
        >
        <Menu_icon color={color[1] || '#3D4EEA'}  />
          {/* <Image alt="Picture" src={arrow} className={styles.arrow} width={20} height={20} style={{ backgroundColor: color[2] }} /> */}
        </div> :
          <Image alt="Picture" src={arrow} className={styles.arrow} style={{ opacity: 0 }} width={20} height={20} />

      }

      {text ?
        <h3 style={mes ? new_text_mes : new_text}>
          {mes ? <Image
            src={url + 'var/data/' + profile.nikname + '/main.jpg'}
            alt="menu"
            className={styles.image_master}
            width={39} height={40}
          /> : null}

          {text}
        </h3>
        : 
        <div className={styles.logo}>         
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