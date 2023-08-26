import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/master.module.css'

import Header from '@/components/header'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setmaster } from '@/reduser'
import Reviews from '@/components/reviews'
import Services from '@/components/services'
import Lenta from '@/components/lenta'
import Sertificats from '@/components/serificats'
import Menu_icon from '@/components/icons/menu'
import Link from 'next/link'
import MasterHeader from '@/components/masterheader'
import { my_tema } from '@/data.'
import useSWR from 'swr'


const active = {
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500
}



export default function Master() {
    const router = useRouter()
    const { slug } = router.query
    const [message, setmessage] = useState(false)
    const [nav_view, setNavView] = useState(0) 
    const [color , setColor] = useState(my_tema[0].color)  
   
    const dispatch = useDispatch()
    const my_profile = useSelector(state => state.counter.profile)
    const service = useSelector(state=>state.counter.service)
   

    const { data:profile } = useSWR(slug ? `/api/master?nikname=${slug}` : null,
    {onSuccess:(profile)=> profile.status ? 
        (
            setColor(my_tema[+profile.tema].color),
            dispatch(setmaster({...profile,nikname: slug}))
        ) 
        : router.push('/404')
    })
    // const [gradient, color, background] = my_tema[profile.tema].color
    function LinkTo(a) {
        if (my_profile.status === 'client') {
            router.push(a)
            
        } else {
            setmessage(true)
        }
    }
    
    return (
        <>
            <Head><title>{slug}</title></Head>
            {profile ? <Header text={slug} sel={'/masternear/' + service} col={my_tema[+profile.tema]} /> :null}
            {profile ? <MasterHeader profile={profile} slug={slug} /> : null }

            {profile ? <section className={styles.section_main}>
                {message ? <div  className={styles.dialog}>
                        <div >
                            <span onClick={() => setmessage(false)}>закрыть</span>
                            <h4>
                                Эта функция доступна только<br />
                                зарегистрированным пользователям. Для<br />
                                продолжения войдите или зарегистрируйте<br />
                                аккаунт.
                            </h4>
                            <Link href="/enter">Войти</Link>
                        </div>
                    </div>
                    : null
                }
                <div className={styles.buttons}>
                    <div onClick={() => LinkTo(`/chat/messages/${slug}?name=${profile.name}`)} style={{ backgroundColor: color[1] }} >
                        <span style={{ color: color[2] }} title="Отправить сообщение мастеру">
                            Сообщения
                            <Menu_icon type="chat" color={color} />
                        </span>
                    </div>
                    <div onClick={() => LinkTo(`/recordingtomaster?nikname=${slug}&name=${profile.name}`)}
                        style={{ backgroundColor:color[0] }}
                    >
                        <span style={{ color: color[1] }} title='Запись к мастеру'>
                            Запись к мастеру
                            <Menu_icon type="edit" color={color} />
                        </span>
                    </div>
                </div>
                <nav className={styles.navigation}>
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map((i, index) => <span key={i} onClick={() => setNavView(index)} style={+nav_view === index ? { ...active, backgroundColor: color[1] } : null}>{i}</span>)}
                </nav>
                {nav_view === 3 ? <Reviews nikname={slug} color={color} /> :
                    nav_view === 1 ? <Services name={slug} color={color} nav={nav_view}/> :
                        nav_view === 0 ? <Lenta nikname={slug} color={color} name={profile.name} /> :
                            <Sertificats nav={nav_view} nikname={slug} />}
            </section>: null}
           
        </>



    )

}

