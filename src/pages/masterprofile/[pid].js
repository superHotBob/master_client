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
import { url } from '@/data.'


const nav_active = ({
    color: "#fff",
    padding: '0 20px',
    fontWeight: 500
})
const text = {
    'Отзывы': `Здесь будут отображаться отзывы на выполенные
    вами заказы и проведенные мероприятия.
    `,
    'Услуги': `Здесь будут отображаться ваши слуги  прайс лиcт 
    по категориям. Вы сможете редактировать его в
    любое время, дополняя и редактируя его.`,
    'Лента': `Здесь будут фотографии ваших работ, которые 
    будут видны клиентам и другим мастерам. Они
    смогут их сохранять в закладки, что бы не
    потерять вас из виду.
    `,
    'Сертификаты': `Расскажите о своем профессиональном опыте,
    продемонстрируйте всем свое мастеркство и
    продтвердите это сертификатами.                    
    `
}

export default function Client() {
    const router = useRouter()
    const { pid } = router.query
    const [view, setView] = useState(true)
    const [profile, setProfile] = useState()
    const [nav_view, setNavView] = useState('Лента')
    const [newSertificat, AddNewSertificat] = useState(false)
    const [lists, setlists] = useState()

    useEffect(() => {
        const pro = JSON.parse(localStorage.getItem('profile'))
        if (pro.nikname !== pid) {
            return () => router.push('/enter')
        }
        if (pro) {
            function GetLists() {
                fetch(`/api/get_images?nikname=${pro.nikname}`)
                    .then(res => res.json())
                    .then(res => setlists(res))
            }
            GetLists()
            setProfile(pro)
        } else {
            router.push('/enter')
        }
    }, [pid])


    function Load(a) {
        document.getElementById(a).style.opacity = 1
    }



    return (
        <>
            <Head><title>{pid}</title></Head>
            <Header sel='back' text='Мой профиль' color={profile?.color} />
            <MasterHeader profile={profile} master={pid} />
            <nav className={styles.navigation}>
                {['Лента', 'Услуги', 'Сертификаты', 'Отзывы']
                    .map(i => <span key={i} onClick={() => setNavView(i)} style={nav_view === i ? { ...nav_active, background: profile?.color[1] } : null}>{i}</span>)}
            </nav>
            {profile ? <>
                <section className={styles.lenta}>

                    <Message color={profile.color} text={text[nav_view]} page="masterprofile" />
                    {nav_view === 'Услуги' ? <>
                        <div onClick={() => setView(false)} className={styles.uslugi_plus} style={{ backgroundColor: profile.color[1] }}>
                            Редактировать категории и услуги
                        </div>
                        <Services color={profile.color} name={pid} />
                        <AddService view={view} setView={setView} color={profile.color} />

                    </> : null}
                    {nav_view === 'Лента' ? <>
                        <div className={styles.lenta_selector}>
                            <Link
                                href="/addlist"
                                className={styles.addlist}
                                style={{ color: profile.color[1], backgroundColor: profile.color[2] }}
                            >Добавить публикацию +</Link>
                            <Link
                                href="/displaypublications"
                                className={styles.uslugi}
                                style={{ color: profile.color[1], backgroundColor: profile.color[2] }}
                            >
                                Показ
                                <Menu_icon type="dashboard" color={profile.color[1]} />
                            </Link>
                        </div>
                        <div className={styles.all__images}>
                            <div className={styles.lenta_images}>
                                {lists?.filter((i, index) => index % 2 == 0).map(i =>
                                    <img
                                        key={i.id}
                                        id={i.id}
                                        alt="my_image"
                                        onLoad={() => Load(i.id)}
                                        className={styles.lenta_image}
                                        src={url + "/var/data/" + pid + '/' + i.id + '.jpg'}
                                    />
                                )}
                            </div>
                            <div className={styles.lenta_images}>
                                {lists?.filter((i, index) => index % 2 !== 0).map(i =>
                                    <img
                                        key={i.id}
                                        onLoad={() => Load(i.id)}
                                        id={i.id}
                                        alt="my_image"
                                        className={styles.lenta_image}
                                        src={url + "/var/data/" + pid + '/' + i.id + '.jpg'}
                                    />
                                )}
                            </div>
                        </div>
                    </> : null}
                    {nav_view === 'Сертификаты' ? <>
                        <div onClick={() => AddNewSertificat(true)} className={styles.uslugi_plus} style={{ color: '#fff', backgroundColor: profile.color[1] }}>
                            Добавить сетрификат +
                        </div>
                        <Sertificats nikname={pid} />
                        {newSertificat ? <AddSertificat setView={setView} color={profile.color} nikname={profile.nikname} view={AddNewSertificat} /> : null}


                    </> : null}
                    {nav_view === 'Отзывы' ? <Reviews color={profile.color} nikname={profile.nikname} /> : null}
                </section>
                <Navi color={profile.color[0]} />
            </> : null}
        </ >
    )
}