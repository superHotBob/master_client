import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/master.module.css'

import Header from '@/components/header'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setmaster } from '@/reduser'
import Reviews from '@/components/reviews'
import Services from '@/components/services'
import Lenta from '@/components/lenta'
import Sertificats from '@/components/serificats'
import { useSelector } from 'react-redux'
import Menu_icon from '@/components/icons/menu'
import Link from 'next/link'
import MasterHeader from '@/components/masterheader'
import { my_data } from '@/data.'
import { useEffect } from 'react'


const active = {
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500

}

export async function getServerSideProps({ params }) {
    const res = await fetch(`https://masterplace.netlify.app/api/master?nikname=${params.slug}`);
    const profile = await res.json();
    return {
        props: {
            profile,
        },
    };
}

export default function Master({ profile }) {
    const [message, setmessage] = useState(false)
    const [nav_view, setNavView] = useState(0)  

    const router = useRouter()
    const { slug } = router.query
    const [gradient, color, background] = my_data['my_tema'][0].color
    const dispatch = useDispatch()
    const my_profile = useSelector(state => state.counter.profile)
    const service = useSelector(state => state.counter.service)
    const master = useSelector(state => state.counter.master)


    
    useEffect(()=>{
        if(profile) {
            if(Object.keys(profile).length) {
                dispatch(setmaster(profile))    
            } else {
                router.push('/404')
            }    
        }
    },[router])

    

    // useEffect(() => {
    //     const abortController = new AbortController();

    //     if (!slug) { return; }

    //     const FetchData = async () => {
    //         fetch(`/api/master?nikname=${slug}`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 if (res.status === 'master') {
    //                     setProfile(res)
    //                     dispatch(setmaster(res))
    //                 } else {
    //                     document.getElementById('message').innerText = 'Такого мастера нет'
    //                 }
    //             })
    //             .catch(err => console.log(new Error(err)))

    //     }

    //     // if (master && my_profile) {
    //     //     setProfile(master)
    //     // } else {
    //         FetchData()
    //     // }
    //     return () => {
    //         abortController.abort();
    //     };
    // }, [slug])

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
            <Header text={slug} sel="back" color={profile?.color} />
            <MasterHeader profile={profile} master={slug} />

            <section className={styles.section_main}>
                <dialog open={message} className={styles.dialog}>
                    <div>
                        <span onClick={() => setmessage(false)}>закрыть</span>
                        <h4>
                            Эта функция доступна только<br />
                            зарегистрированным пользователям. Для<br />
                            продолжения войдите или зарегистрируйте<br />
                            аккаунт.
                        </h4>
                        <Link href="/enter">Войти</Link>
                    </div>
                </dialog>
                <div className={styles.buttons}>
                    <div onClick={() => LinkTo(`/chat/messages/${slug}?name=${profile.name}`)} style={{ backgroundColor: background }} >
                        <span style={{ color: color }} title="Отправить сообщение мастеру">
                            Сообщения
                            <Menu_icon type="chat" color={color} />
                        </span>
                    </div>
                    <div onClick={() => LinkTo(`/recordingtomaster?nikname=${slug}&name=${profile.name}`)}
                        style={{ backgroundColor: background }}
                    >
                        <span style={{ color: color }} title='Запись к мастеру'>
                            Запись к мастеру
                            <Menu_icon type="edit" color={color} />
                        </span>
                    </div>
                </div>
                <nav className={styles.navigation}>
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map((i, index) => <span key={i} onClick={() => setNavView(index)} style={nav_view === index ? { ...active, backgroundColor: color } : null}>{i}</span>)}
                </nav>
                {nav_view === 3 ? <Reviews nikname={slug} color={profile?.color} /> :
                    nav_view === 1 ? <Services name={slug} color={profile?.color} /> :
                        nav_view === 0 ? <Lenta nikname={slug} color={profile?.color} name={profile?.name} /> :
                            <Sertificats nikname={slug} />}
            </section>
            {/* <Navi color={gradient} /> */}
        </>



    )

}

