import arrow from '../../../../public/arrow_back_bold.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../information.module.css'

export default function contacts() {

    const router = useRouter()

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>Контакты</h4>
                <h4 onClick={() => router.push("/")}>Закрыть</h4>
            </header>
            <section className={styles.links}>
                <h3>Контакты</h3>
                <p><dd>Tелефон:</dd> <dt>+375 00 000 00 00</dt></p>
                <p><dd>Телефон:</dd> <dt>+375 11 000 00 00</dt></p>
                <p><dd>Почта:</dd> <dt>support@masters.place</dt></p>               
            </section>
        </main>
    )
}