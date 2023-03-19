import styles from './menu.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setclient, setprofile } from "@/reduser"
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
    const profile = useSelector((state) => state.counter.profile)

    function CopyProfile() {
        navigator.clipboard.writeText(window.location.host + '/master/' + profile.nikname)
        alert("Copied the text: " + window.location.host);
    }
    function ExitFromAccount() {
        dispatch(setprofile({}))
        localStorage.clear()
        router.push('/')
    }

    return (<>
        {profile.status === 'master' ? <main className={styles.main_menu}>
            <h6>Меню профиля</h6>
            <Link href='/chat'>Сообщения</Link>
            <p className={styles.seans}>Записи на сеанс<span>5</span></p>
            <p className={styles.shedule} onClick={() => router.push('/calendar')}>Календарь работы</p>
            <p className={styles.add}>Добавить запись</p>
            <Link href="/masterrecords" className={styles.collections}>Мои заказы</Link>
            <h6>Общее</h6>
            <p className={styles.edit_profile} onClick={() => router.push('/masterprofile/' + profile.nikname)} >
                Редактировать профиль
            </p>
            <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
            <p className={styles.chat}>Техническая поддержка</p>
            <p className={styles.about}>О сервисе</p>
            <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
        </main>
            : profile.status === 'client' ?
                <main className={styles.main_menu}>
                    <h6>Меню профиля</h6>
                    <Link href='/chat'>Сообщения</Link>
                    <Link href={{
                        pathname: `/client/${profile.nikname}`,
                        query: {
                            order: false
                        }
                    }} className={styles.collections}>Мои заказы</Link>
                    <h6>Общее</h6>
                    <Link href={`/client/${profile.nikname}`} className={styles.edit_profile}>Настройки профиля</Link>
                    <p className={styles.copy} onClick={CopyProfile}>Скопировать ссылку профиля</p>
                    <p className={styles.chat}>Техническая поддержка</p>
                    <p className={styles.about}>О сервисе</p>
                    <p onClick={ExitFromAccount}>Выйти из аккаунта</p>
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