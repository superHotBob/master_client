import Image from "next/image"
import styles from './menu.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setmaster } from "@/reduser"

const style = {
    backdropFilter: 'none',
    background: 'rgba(255, 255, 255, 1)'
}

export default function Menu() {
    const dispatch = useDispatch()
    const master = useSelector((state) => state.counter.master)
    const client = useSelector((state) => state.counter.client)
    return (
        <main className={styles.main_menu} style={master || client ? 'none': style}>
            {master || client ?<h6>Меню профиля</h6>:null}
            {master || client ? <p >Сообщения</p> : null}
            {master ? <p className={styles.seans}>Записи на сеанс<span>5</span></p> : null }
            {master ? <p className={styles.shedule}>Календарь работы</p>:null }
            {master ? <p className={styles.add}>Добавить запись</p>: null }
            {master || client ? <p className={styles.collections}>Мои заказы</p>:null}
            <h6>Общее</h6>
            {master || client ? <p className={styles.edit_profile}>Редактировать профиль</p>:null}
            {master || client ? <p className={styles.copy}>Скопировать ссылку профиля</p>:null}
            <p className={styles.chat}>Техническая поддержка</p>
            <p className={styles.about}>О сервисе</p>
            {master || client ? <p onClick={()=>dispatch(setmaster())}>Выйти из аккаунта</p> :
            <p onClick={()=>dispatch(setmaster())}>Войти в аккаунт</p>}
        </main>
    )
}