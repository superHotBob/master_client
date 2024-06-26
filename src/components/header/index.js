import Image from 'next/image'
import styles from './header.module.css'
import call from '../../../public/call.svg'
import { useSelector, useDispatch } from 'react-redux'
import Menu from '../menu'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setprofile } from '@/reduser'
import Menu_icon from '../../components/icons/menu.js'
import useSWR from 'swr'
import { my_tema } from '@/data.'
import Messages from '../messages'


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


export default function Header({ sel, text, mes, col = my_tema[0].color, select,view_time ,name}) {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.counter) 
  const router = useRouter()
  const [menu, menuView] = useState(false)
  const [phone, setphone] = useState()
  const { data } = useSWR(profile.status === 'master' ? `/api/get_new_orders_master?nikname=${profile.nikname}`
  : null, {loadingTimeout:5000})

  
  
  useEffect(() => {
    let pro = JSON.parse(localStorage.getItem("profile"))    
    if (pro) {
      dispatch(setprofile(pro))
    }   
  }, [])

  
  const getPhone = () => {
    if(phone) {
      setphone(null)
      return;
    }
    fetch(`/api/get_phone?name=${name}`)
    .then(res=>res.text()
    .then(res=>setphone(res)))
  }

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
          style={{ backgroundColor: col[2] }}
        >
          <Menu_icon color={col[1] || '#3D4EEA'} />
        </div>
        : 
        <div className={styles.shadow_arrow} />
      }

      {text ?
        <h4 style={mes ? new_text_mes : new_text}>
          {mes ? <Image
            src={process.env.url_image  + name + '.jpg'}
            alt="menu"
            className={styles.image_master}
            width={39} height={40}
          /> : null}

          <span>{text}</span>
        </h4>
        :
        <div className={styles.logo}>
          <b>masters.</b>
          <b>place</b>
        </div>
      }
      {mes && name != 'администратор' ? <Image
        src={call}
        alt="phone"      
        className={styles.call}
        width={10} height={10}
        onClick={getPhone}
      /> : null}    
      <div
        className={styles.left__arrow}
        onClick={() => menuView(!menu)}
        style={{ backgroundColor: menu ? col[1] || '#3D4EEA' : col[2]}}
      >
        {data && !menu? <span className={styles.count}>{data}</span> : null}
        <Menu_icon  color={menu ? col[2] || '#3D4EEA' : col[1] || '#3D4EEA'} type={menu ? 'close' : 'menu'} />
      </div>     
      {menu && <Menu  count={data} profile={profile} /> }
      {phone && <Messages phone={phone} name={text} nikname={name} close={getPhone} /> }
    </header>
  )
}