import styles from './menu.module.css'
import { useDispatch } from 'react-redux'
import { setprofile,setnew_message } from "@/reduser"
import { useRouter } from "next/router"
import Link from 'next/link'
import useSWR from 'swr'


const style = {
    backdropFilter: 'none',
    background: 'rgba(255, 255, 255, 1)'
}
const login = {
    backgroundImage: "url('/login.svg')"
}

export default function Menu({ count, profile }) {
    const chat = JSON.parse(localStorage.getItem('chat'))
    const dispatch = useDispatch()
    const router = useRouter()
    const { data } = useSWR(profile.status ? `
        /api/get_new_messages?nikname=${profile.nikname}&status=${profile.status}&chat=${chat}
        `: null)


    if(data){
        dispatch(setnew_message(data))
    }
    function CopyProfile() {
        navigator.clipboard.writeText(window.location.host + '/' + profile.status + '/' + profile.nikname)
        alert("Copied the text: " + window.location.host);
    }
    function ExitFromAccount() {
        dispatch(setprofile({}))
        localStorage.removeItem('profile')       
        document.cookie = "key=; max-age=0"
        document.cookie = "nikname=; max-age=0"
        router.push('/')
    }
    return (
        <>
            {profile.status === 'master' ?
                <main className={styles.main_menu}>
                    <p className={styles.menu_prof}>Меню профиля</p>
                    <Link href='/chat'>
                        Сообщения
                        {data ? <span>{data}</span> : null}
                    </Link>
                    <Link href="/masterrecords" className={styles.records_on_seans}>
                        Записи на сеанс
                        {count ? <span>{count}</span> : null}
                    </Link>
                    <Link href="/calendar" className={styles.shedule} >Календарь работы</Link>
                    <Link href="/masterrecords" className={styles.add}>Добавить запись</Link>
                    <Link href="/masterrecords" className={styles.collections}>Мои заказы</Link>
                    <p className={styles.menu_prof}>Общее</p>
                    <Link href="/editprofile" className={styles.edit_profile}>Редактировать профиль</Link>
                    <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
                    <p className={styles.chat}>Техническая поддержка</p>
                    <Link href="/informations/aboutservice" className={styles.about}>О сервисе</Link>
                    <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
                </main>
                : profile.status === 'client' ?
                    <main className={styles.main_menu}>
                        <p className={styles.menu_prof}>Меню профиля</p>
                        <Link href='/chat'>
                            Сообщения
                            {data ? <span>{data}</span> : null}
                        </Link>
                        <Link href={{
                            pathname: `/clientprofile/${profile.nikname}/orders`,

                        }} className={styles.collections}>Мои заказы</Link>
                        <p className={styles.menu_prof}>Общее</p>
                        <Link href="/editprofile/client" className={styles.edit_profile}>Настройки профиля</Link>                       
                        <p className={styles.chat}>Техническая поддержка</p>
                        <Link href="/informations/aboutservice" className={styles.about}>Информация</Link>
                        <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
                    </main> :
                    <main className={styles.main_menu} style={style}>
                        <p className={styles.menu_prof}>Общее</p>
                        <p className={styles.chat}>Техническая поддержка</p>
                        <Link href="/informations/aboutservice" className={styles.about}>Информация</Link>
                        <p onClick={() => router.push("/enter")} style={login}>Войти в аккаунт</p>
                    </main>}
        </>
    )
}