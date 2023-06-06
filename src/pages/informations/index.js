import Header from '@/components/header'
import Link from 'next/link'
import Image from 'next/image'
import  eye  from '../../../public/eye.svg'
import  heat  from '../../../public/heart.svg'
import  paper  from '../../../public/paper.svg'
import  message  from '../../../public/message_info.svg'
import  politic  from '../../../public/politic.svg'
import  flag  from '../../../public/flag.svg'
import styles from './information.module.css'


export default function Informations() {
    return (
        <main className={styles.main}>
            <Header text="Информация" sel="back"/>
            <section className={styles.links}>
                <Link href="/">
                    <Image src={eye} width={20} height={20} alt="eye" />
                    Помощь

                </Link>
                <Link href="/">
                <Image src={heat} width={20} height={20} alt="heat" />
                    О сервисе
                    </Link>
                <Link href="/">
                <Image src={message} width={20} height={20} alt="heat" />
                    Контакты
                    </Link>
                <Link href="/">
                <Image src={paper} width={20} height={20} alt="heat" />
                    Пользовательское соглашение
                </Link>
                <Link href="/">
                <Image src={politic} width={20} height={20} alt="heat" />
                    Политика обработки персональных данных 
                    </Link>
                <Link href="/">
                <Image src={flag} width={20} height={20} alt="heat" />
                    Публичная оферта 
                    </Link>
            </section>


        </main>
    )
}