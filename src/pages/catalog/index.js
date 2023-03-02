import Header from '@/components/header'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import styles from './catalog.module.css'
import position from '../../../public/position.svg'
import { Dela_Gothic_One } from 'next/font/google'

const dela = Dela_Gothic_One({
    weight: '400',
    subsets: ['latin'],
})
const images = ['manicur', 'pedicur', 'makiash', 'resnici','chistka',
    'brovi', 'depil', 'massage', 'strishka', 'colored', 'pricheska', 'barber']
export default function Catalog() {
    return (
        <div className={dela.className}>
            <div className={styles.main}>
                <Header />
                <section className={styles.section}>
                    <div className={styles.city}>
                        <Link href="/city"> Выбрать ваш город</Link>
                        <Image alt="Picture of the author" src={position} width={20} height={20} />
                    </div>
                    <Link href="/" className={styles.model}>
                        СТАТЬ МОДЕЛЬЮ <br/> БЕСПЛАТНО
                    </Link>
                    <Link href="/" className={styles.master}>
                        СТАТЬ МАСТЕРОМ
                    </Link>
                    <div className={styles.images}>
                        {images.map(i => <Link href={'/catalog/service/' + i } key={i}>
                        <Image  alt="image" src={'/' + i + '.svg'} width="80" height='90' />
                        </Link>)}
                    </div>
                    <Link href="/catalog/services" className={styles.uslugi}>
                        Все услуги
                    </Link>
                    <Link href="/" className={styles.around__masters}>
                        Мастера рядом
                    </Link>
                    <h3>Информация</h3>
                    {['Помощь','О сервисе','Контакты','Пользовательское соглашение',
                        "Политика обработки персональных данных",'Публичная оферта'].map((i,index)=>
                        <Link key={index} className={styles.info} href="/">{i}</Link>
                    )}
                    <h6 className={styles.agreement}>© 2022 – 2023 Некоммерческая организация. Все права защищены.</h6>
                </section>
                <Navi page="catalog" />

            </div>
        </div>
    )

}