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
import useSWR from 'swr'


const new_text = {
  color: '##282828', 
  lineHeight: '26px',
  display: 'inline-block',

}
const new_text_mes = {
  color: '##282828',  
  lineHeight: '26px',
  display: 'inline-block',
  marginLeft: '-35px'
}


export default function Header({ sel, text, mes, color = {}, select,view_time ,name}) {
  const profile = useSelector((state) => state.counter.profile)
  const { data } = useSWR(profile.status === 'master' ?
  `/api/get_new_orders_master?nikname=${profile.nikname}`
  : null, {loadingTimeout:3000})
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

  const ToBack = (e) => {
    e.stopPropagation()
    if (sel !== 'back') {
      return router.push(sel)
    }
    router.back()
  }
  return (
    <header className={styles.header} >
      {sel ?
        <div
          onClick={view_time ? ()=>select(true) : ToBack }
          className={styles.left__arrow}
          style={{ backgroundColor: color[2] }}
        >
          <Menu_icon color={color[1] || '#3D4EEA'} />
        </div>
        :
        <Image alt="Picture" src={arrow} className={styles.arrow} style={{ opacity: 0 }} width={20} height={20} />

      }

      {text ?
        <h4 style={mes ? new_text_mes : new_text}>
          {mes ? <Image
            src={process.env.url + 'var/data/' + name + '/main.jpg'}
            alt="menu"
            className={styles.image_master}
            width={39} height={40}
          /> : null}

          {text}
        </h4>
        :
        <div className={styles.logo}>
          <h2>masters.</h2>
          <h2>place</h2>
        </div>
      }
      {mes ? <Image
        src={call}
        alt="phone"
        style={{ transform: 'transitionX(20px)' }}
        className={styles.call}
        width={10} height={10}
      /> : null}    
      <div
        className={styles.left__arrow}
        onClick={() => menuView(!menu)}
        style={{ backgroundColor: menu ? color[1] || '#3D4EEA' : color[2]}}
      >
        {data && !menu? <span className={styles.count}>{data}</span> : null}
        <Menu_icon  color={menu ? color[2] || '#3D4EEA' : color[1] || '#3D4EEA'} type={menu ? 'close' : 'menu'} />
      </div>     
      {menu ? <Menu  count={data} profile={profile} /> : null}
    </header>
  )
}