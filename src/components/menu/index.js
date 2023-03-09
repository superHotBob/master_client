import Image from "next/image"
import styles from './menu.module.css'
import { useDispatch } from 'react-redux'
import { setmaster } from "@/reduser"

export default function Menu() {
    const dispatch = useDispatch()
    return (
        <main className={styles.main_menu}>
            <h6>Меню профиля</h6>
            <p >Сообщения</p>
            <p className={styles.seans}>Записи на сеанс<span>5</span></p>
            <p className={styles.shedule}>Календарь работы</p>
            <p className={styles.add}>Добавить запись</p>
            <p className={styles.collections}>Мои заказы</p>
            <h6>Общее</h6>
            <p className={styles.edit_profile}>Редактировать профиль</p>
            <p className={styles.copy}>Скопировать ссылку профиля</p>
            <p className={styles.chat}>Техническая поддержка</p>
            <p className={styles.about}>О сервисе</p>
            <p onClick={()=>dispatch(setmaster())}>Выйти из аккаунта</p>
        </main>
    )
}