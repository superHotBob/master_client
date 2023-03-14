import Header from '@/components/header'
import styles from '/aplica.module.css'


export default function Aplica() {
    return (
        <main className={styles.main}>
            <Header text="Подать заявку" />
            <section>
                <div className={styles.message} >
                Для участия в мероприятиях вы должны <br/>
                быть зарегестрированны в сервисе.
                </div>

            </section>

        </main>

    )
}