import Header from '@/components/header'
import Link from 'next/link'
import Image from 'next/image'
import eye from '../../../public/eye.svg'
import heat from '../../../public/heart.svg'
import paper from '../../../public/paper.svg'
import message from '../../../public/message_info.svg'
import politic from '../../../public/politic.svg'
import flag from '../../../public/flag.svg'
import styles from './information.module.css'


export default function Informations() {
    return (
        <main className={styles.main}>
            <Header text="Информация" sel="back" />
            <section className={styles.links}>               
                <Link href="/informations">
                    <Image src={message} width={20} height={20} alt="heat" />
                    Контакты
                </Link>
                <p>+375 00 000 00 00</p>
                <p>+375 11 000 00 00</p>
                <p>support@masters.place</p>
                {/* <Link href="/informations">
                    <Image src={paper} width={20} height={20} alt="heat" />
                    Пользовательское соглашение
                </Link>
                <p>Согласны на всё</p>
                <Link href="/">
                    <Image src={politic} width={20} height={20} alt="heat" />
                    Политика обработки персональных данных
                </Link>
                <p>Мы аполитичны</p>
                <Link href="/informations">
                    <Image src={flag} width={20} height={20} alt="heat" />
                    Публичная оферта
                </Link>
                <p>Сами не знаем, что это.</p> */}
            </section>


        </main>
    )
}