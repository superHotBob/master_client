import styles from './profile.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Message from '@/components/message'
import { useDispatch } from 'react-redux'
import { settema } from '@/reduser'
import Services from '@/components/services'
import Sertificats from '@/components/serificats'
import AddSertificat from '@/components/addsertificat'
import Menu_icon from '@/components/icons/menu'
import AddService from '@/components/addservise'
import MasterHeader from '@/components/masterheader'
import Reviews from '@/components/reviews'
import { my_tema } from '@/data.'
import Lenta from '@/components/lenta'
import { useSelector } from 'react-redux'


const nav_active = ({
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500
})
const text = {
    'Отзывы': 'Здесь будут отображаться отзывы на выполенные вами заказы и проведенные мероприятия.',
    'Услуги': 'Здесь будут отображаться ваши слуги  прайс лиcт по категориям. Вы сможете редактировать его в любое время, дополняя и редактируя его.',
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
    const tema = useSelector(state => state.counter.tema)
    const dispatch = useDispatch()

    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        if (pro) {
            dispatch(settema(my_tema[+pro?.tema].color))
            setProfile(pro)
        } else {
            router.push('/')
        }
        return () => dispatch(settema(my_tema[0].color))
    }, [pid, router])

    const viewService = () => {
        setView(false)
        window.scrollTo(0, 0)
    }
    return (
        <>
            <Head><title>{pid}</title></Head>
            {profile ? <>
                <Header sel='back' text='Мой профиль' col={tema} />
                <MasterHeader profile={profile} slug={pid} />
                <nav className={styles.navigation} >
                    {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                        .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? { ...nav_active, background: tema[1] } : null}>{i}</span>)}
                </nav>
                <Message color={tema} text={text[nav_view]} page="masterprofile" />
                <section className={styles.lenta}>
                    {nav_view === 'Услуги' ? 
                        <>
                            <div onClick={() => viewService(false)} className={styles.uslugi_plus} style={{ backgroundColor: tema[1] }}>
                                Редактировать категории и услуги
                            </div>
                            <Services currency={profile.currency} color={tema} name={pid} view={view} />
                            <AddService view={view} setView={setView} color={tema} />
                        </> 
                        : nav_view === 'Лента' ? 
                        <>
                            <div className={styles.lenta_selector}>
                                <Link
                                    href="/addlist"
                                    className={styles.addlist}
                                    style={{ color: tema[2], backgroundColor: tema[1] }}
                                >Добавить публикацию +</Link>
                                <Link
                                    href="/displaypublications"
                                    className={styles.uslugi}
                                    style={{ color: tema[2], backgroundColor: tema[1] }}
                                >
                                    Показ
                                    <Menu_icon type="dashboard" color={tema[2]} />
                                </Link>
                            </div>
                            <Lenta nikname={pid} name={profile.name} color={tema} />
                        </> 
                        : nav_view === 'Сертификаты' ? 
                        <>
                            <div onClick={() => AddNewSertificat(true)} className={styles.uslugi_plus} style={{ color: '#fff', backgroundColor: tema[1] }}>
                                Добавить сетрификат +
                            </div>
                            <Sertificats nikname={pid} nav={2} />
                            {newSertificat ? <AddSertificat setView={setView} color={tema} nikname={profile.nikname} view={AddNewSertificat} /> : null}
                        </> 
                        : 
                        <Reviews color={tema} nikname={profile.nikname} />
                    }
                </section>

            </> : null}
        </>
    )
}