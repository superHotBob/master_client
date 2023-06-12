import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './catalog.module.css'
import position from '../../../public/position.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setservice } from '../../reduser.js'
import { useRouter } from 'next/router'


const images = ['маникюр', 'педикюр', 'макияж', 'ресницы', 'чистка',
    'брови', 'депиляция', 'массаж', 'стрижка', 'окрашивание', 'прически', 'барбер']
export default function Catalog() {
    const dispatch = useDispatch()
    const router = useRouter()
    const city = useSelector(state => state.counter.city)
    const ToService = (a) => {
        dispatch(setservice(a))
        router.push(`/masternear/${a}`)
    }

    return (
        <>
            <Header />
            <section className={styles.section}>
                <Link className={styles.city} href="/city"> Ваш город {city}
                    <Image alt="Picture of the author" src={position} width={20} height={20} />
                </Link>
                <Link href="/event" className={styles.model}>
                    СТАНЬ МOДЕЛЬЮ БЕCПЛАТНO
                </Link>
                <Link href="/" className={styles.master}>
                    СТАНЬ МАСТЕРОМ
                </Link>
                <div className={styles.images}>
                    {images.map(i =>
                        <Image key={i} onClick={() => ToService(i)} alt="image" src={'/' + i + '.svg'} width="80" height='90' />
                    )}
                </div>
                <Link href="/catalog/services" className={styles.uslugi}>
                    Все услуги
                </Link>
                <Link href="/masternear/city" className={styles.around__masters}>
                    Мастера рядом
                </Link>
                <h3>Информация</h3>
                {['Помощь', 'О сервисе', 'Контакты', 'Пользовательское соглашение',
                    "Политика обработки персональных данных", 'Публичная оферта'].map((i, index) =>
                        <Link key={index} className={styles.info} href="/">{i}</Link>
                    )}
                <h6 className={styles.agreement}>© 2022 – 2023 Некоммерческая организация. Все права защищены.</h6>
            </section>

        </>

    )

}