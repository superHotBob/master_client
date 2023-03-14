import Header from '@/components/header'
import styles from './apply.module.css'
import Link from 'next/link'
import Navi from '@/components/navi'
export default function Apply() {
    return (
        <div className={styles.main}>
            <Header text="Подать заявку" sel="/event" />
            <section className={styles.section}>
                <div className={styles.message} >
                    Для участия в мероприятиях вы должны <br /> быть зарегестрированны в сервисе.
                </div>
                <input type="text" placeholder='Ваше имя' />
                <input type="text" placeholder='Номер телефона' />
                <Link href="/" className={styles.add_photo}>Добавить фото профиля</Link>
                <button>Принять участие</button>
                <h4>
                    Нажмая на кнопку, вы соглашаетесь с<br />
                    <b style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                        данных</b>  и <b style={{ color: "#3D4EEA" }}>Пользовательским соглашением</b>
                </h4>
                <h3>У вас уже есть аккаунт?</h3>
                <Link href='/enter' className={styles.enter}>Войти</Link>

            </section>
            <Navi page="catalog"/>
        </div>
    )
}