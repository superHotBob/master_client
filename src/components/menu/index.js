import styles from './menu.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setclient, setprofile } from "@/reduser"
import { useRouter } from "next/router"
import Link from 'next/link'


const style = {
    backdropFilter: 'none',
    background: 'rgba(255, 255, 255, 1)'
}
const login = {
    backgroundImage: "url('/login.svg')"
}

export default function Menu() {

    const dispatch = useDispatch()
    const router = useRouter()
    const profile = useSelector((state) => state.counter.profile)

    function CopyProfile() {
        navigator.clipboard.writeText(window.location.host + '/' +  profile.status + '/' + profile.nikname)
        alert("Copied the text: " + window.location.host);
    }
    function ExitFromAccount() {
        dispatch(setprofile({}))
        localStorage.clear()
        router.push('/')
    }
   

    return (
    <>
        {profile.status === 'master' ? <main className={styles.main_menu}>
            <p className={styles.menu_prof}>Меню профиля</p>
            <Link href='/chat'>Сообщения</Link>
            <Link href="/masterrecords" className={styles.seans}>Записи на сеанс<span>5</span></Link>
            <p className={styles.shedule} onClick={() => router.push('/calendar')}>Календарь работы</p>
            <Link href="/addmasterorder" className={styles.add}>Добавить запись</Link>
            <Link href="/masterrecords" className={styles.collections}>Мои заказы</Link>
            <p className={styles.menu_prof}>Общее</p>
            <p className={styles.edit_profile} onClick={() => router.push('/editprofile')} >
                Редактировать профиль
            </p>
            <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
            <p className={styles.chat}>Техническая поддержка</p>
            <p className={styles.about}>О сервисе</p>
            <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
        </main>
            : profile.status === 'client' ?
                <main className={styles.main_menu}>
                   <p className={styles.menu_prof}>Меню профиля</p>
                    <Link href='/chat'>Сообщения</Link>
                    <Link href={{
                        pathname: `/clientprofile/${profile.nikname}`,
                        query: {
                            order: false
                        }
                    }} className={styles.collections}>Мои заказы</Link>
                     <p className={styles.menu_prof}>Общее</p>
                    <Link href="/editprofile/client" className={styles.edit_profile}>Настройки профиля</Link>
                    {/* <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p> */}
                    <p className={styles.chat}>Техническая поддержка</p>
                    <p className={styles.about}>О сервисе</p>
                    <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
                </main> :
                <main className={styles.main_menu} style={style}>
                    <p className={styles.menu_prof}>Общее</p>
                    <p className={styles.chat}>Техническая поддержка</p>
                    <p className={styles.about}>О сервисе</p>
                    <p onClick={() => router.push("/enter")} style={login}>Войти в аккаунт</p>
                </main>}
    </>
    )
}