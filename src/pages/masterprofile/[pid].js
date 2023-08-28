import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Message from '@/components/message'
import Navi from '@/components/navi'
import Services from '@/components/services'
import Sertificats from '@/components/serificats'
import AddSertificat from '@/components/addsertificat'
import Menu_icon from '@/components/icons/menu'
import AddService from '@/components/addservise'
import MasterHeader from '@/components/masterheader'
import Reviews from '@/components/reviews'
import { my_tema } from '@/data.'
import Lenta from '@/components/lenta'


const nav_active = ({
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500
})
const text = {
    'Отзывы': 'Здесь будут отображаться отзывы на выполенные вами заказы и проведенные мероприятия.',
    'Услуги':'Здесь будут отображаться ваши слуги  прайс лиcт по категориям. Вы сможете редактировать его в любое время, дополняя и редактируя его.',
    'Лента': 'Здесь будут фотографии ваших работ, которые будут видны клиентам и другим мастерам. Они смогут их сохранять в закладки, что бы не потерять вас из виду',
    'Сертификаты': 'Расскажите о своем профессиональном опыте,продемонстрируйте всем свое мастеркство и продтвердите это сертификатами.'                    
    
}

export default function Client() {
    const router = useRouter()
    const { pid } = router.query
    const [view, setView] = useState(true)
    const [profile, setProfile] = useState()
    const [nav_view, setNavView] = useState('Лента')
    const [newSertificat, AddNewSertificat] = useState(false)
    const [lists, setlists] = useState()
    const [tema, setTema] = useState(my_tema[0].color)
   
    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        // if (pro.nikname !== pid) {
        //     return () => router.push('/enter')
        // }
        setTema(my_tema[+pro?.tema].color)
        if (pro) {
            function GetLists() {
                fetch(`/api/get_images?nikname=${pid}`)
                    .then(res => res.json())
                    .then(res => setlists(res))
            }
            // GetLists()
            setProfile(pro)
        } else {
            router.push('/enter')
        }
    }, [pid,router])
    

    



    return (
        <>
            <Head><title>{pid}</title></Head>
            {profile ? <>
            <Header sel='back' text='Мой профиль' col={tema} />
            <MasterHeader profile={profile} master={pid} />
            <nav className={styles.navigation} >
                {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                    .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? { ...nav_active, background: tema[1] } : null}>{i}</span>)}
            </nav>
           
                <section className={styles.lenta}>
                    <Message color={tema} text={text[nav_view]} page="masterprofile" />
                    {nav_view === 'Услуги' ? <>
                        <div onClick={() => setView(false)} className={styles.uslugi_plus} style={{ backgroundColor: tema[1] }}>
                            Редактировать категории и услуги
                        </div>
                        <Services color={tema} name={pid} />
                        <AddService view={view} setView={setView} color={tema} />

                    </> :
                    nav_view === 'Лента' ? <>
                        <div className={styles.lenta_selector}>
                            <Link
                                href="/addlist"
                                className={styles.addlist}
                                style={{ color: tema[2], backgroundColor:tema[1] }}
                            >Добавить публикацию +</Link>
                            <Link
                                href="/displaypublications"
                                className={styles.uslugi}
                                style={{ color: tema[2], backgroundColor: tema[1]}}
                            >
                                Показ
                                <Menu_icon type="dashboard" color={tema[2]} />
                            </Link>
                        </div>                       
                        <Lenta  nikname={pid} name={profile.name} color={tema} />
                    </> : 
                    nav_view === 'Сертификаты' ? <>
                        <div onClick={() => AddNewSertificat(true)} className={styles.uslugi_plus} style={{ color: '#fff', backgroundColor: tema[1] }}>
                            Добавить сетрификат +
                        </div>
                        <Sertificats nikname={pid}  nav={2}/>
                        {newSertificat ? <AddSertificat setView={setView} color={tema} nikname={profile.nikname} view={AddNewSertificat} /> : null}


                    </> :
                    nav_view === 'Отзывы' ? <Reviews color={tema} nikname={profile.nikname} /> : null}
                </section>
                <Navi color={my_tema[profile?.tema][0]} />
            </> : null}
        </>
    )
}