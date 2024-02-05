import Link from "next/link"
import styles from "./info.module.css"


export default function Information() {
    return (
        <>
            <h3 className={styles.information}>Информация</h3>
            <Link className={styles.info} href="/informations/aboutservice" >
                O сервисе
            </Link>
            <Link className={styles.info} href="/informations/contacts" >
                 Контакты
            </Link>
            <Link className={styles.info} href="/informations/agreement" >
                Пользовательское соглашение
            </Link>         
            <Link className={styles.info} href="/become">Стать мастером ?</Link>
            <Link className={styles.info} href="/filling">Заполнение профиля ?</Link>
            <Link className={styles.info} href="/addpublications">Добавить публикацию ?</Link>
            <span className={styles.agreement}>© 2022 – 2023 Некоммерческая организация. Все права защищены.</span>
        </>

    )
}