import arrow from '../../../../public/arrow_back_bold.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../information.module.css'
import Link from 'next/link'

export default function Aboutservice() {

    const router = useRouter()

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>О сервисе</h4>
                <h4 onClick={() => router.push("/")}>Закрыть</h4>
            </header>
            <section className={styles.links}>
                <h3>О сервисе</h3>
                <p> <b>Добро пожаловать на бьюти-маркетплейс индустрии!</b>
                    Мы представляем вам уникальный сервис,
                    разработанный специально для вас.
                    Теперь вы можете публиковать свои свои работы в общей городской ленте.
                    Запись клиентов на вашу услугу происходит на личном профиле по вашему индивидуальному графику который вы создаёте самостоятельно.
                    После создания записи, вы сразу можете начать общение с вашими клиентами через чат.
                    Теперь клиенты могут легко найти вас на карте и выбрать ближайшего мастера, находящегося поблизости от их дома.
                    Начать пользоваться нашей платформой вы можете абсолютно бесплатно, вы ничего не теряете.
                </p>
                <p><Link href="/">masters.place</Link> - теперь все мастера на одной платформе</p>


            </section>
        </main>
    )
}