import styles from './menu.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setmaster, setclient } from "@/reduser"
import { useRouter } from "next/router"
import Link from 'next/link'
import { useEffect } from 'react'

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
    const master = useSelector((state) => state.counter.master)
    const client = useSelector((state) => state.counter.client)
    const profile = useSelector((state) => state.counter.profile)
    
    function CopyProfile() {
        navigator.clipboard.writeText(window.location.host + '/master/' + profile.nikname)
        alert("Copied the text: " + window.location.host);
    }
    
    return (<>
        {profile.status === 'master' ? <main className={styles.main_menu}>
            <h6>Меню профиля</h6>
            <p>Сообщения</p>
            <p className={styles.seans}>Записи на сеанс<span>5</span></p>
            <p className={styles.shedule}>Календарь работы</p>
            <p className={styles.add}>Добавить запись</p>
            <p className={styles.collections}>Мои заказы</p>
            <h6>Общее</h6>
            <p className={styles.edit_profile} onClick={()=>router.push('/masterprofile/' + profile.nikname)} >
                Редактировать профиль
            </p>
            <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
            <p className={styles.chat}>Техническая поддержка</p>
            <p className={styles.about}>О сервисе</p>
            <p onClick={() => dispatch(setmaster(''))}>Выйти из аккаунта</p>
        </main>
            : profile.status === 'client' ? <main className={styles.main_menu}>
                <h6>Меню профиля</h6>
                <p>Сообщения</p>              
                <p className={styles.collections}>Мои заказы</p>
                <h6>Общее</h6>
                <Link href={`/client/${client}`} className={styles.edit_profile}>Настройки профиля</Link>
                <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
                <p className={styles.chat}>Техническая поддержка</p>
                <p className={styles.about}>О сервисе</p>
                <p onClick={() => dispatch(setclient(''))}>Выйти из аккаунта</p>
            </main> :
                <main className={styles.main_menu} style={style}>
                    <h6>Общее</h6>
                    <p className={styles.chat}>Техническая поддержка</p>
                    <p className={styles.about}>О сервисе</p>
                    <p onClick={() => router.push("/enter")} style={login}>Войти в аккаунт</p>
                </main>}
    </>
    )
}