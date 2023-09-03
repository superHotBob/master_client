import Link from "next/link"
import styles from "./info.module.css"
export default function Information() {
    return (
        <>
            <h3 className={styles.information}>Информация</h3>
            {['Помощь', 'О сервисе', 'Контакты', 'Пользовательское соглашение',
                "Политика обработки персональных данных", 'Публичная оферта'].map((i, index) =>
                    <Link key={index} className={styles.info} href="/">{i}</Link>
                )}
            <span className={styles.agreement}>© 2022 – 2023 Некоммерческая организация. Все права защищены.</span>
        </>

    )
}