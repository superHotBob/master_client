import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './event.module.css'
import localFont from 'next/font/local'

// const myFont = localFont({ src: './fonts/DelaGothicOne-Regular.ttf' })

const ev = {
    color: '#fff',
    backgroundColor: '#3D4EEA',
    backgroundImage: 'url(check_double.svg)',
    backgroundPosition: '85% center',
    backgroundSize: '8%',

}

export default function Event() {
    return (
        <div className={styles.main}>
            <Header text="Мероприятия" sel="/catalog/services" />
            <section className={styles.event} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                <p>
                    Серафима Солнцепек<br />
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                <h3>
                    Описание мероприятия, которое<br />
                    зарегал мастер на своем аккаунте.<br />
                    Бесплатно!
                </h3>
                <h4>Метро Красный октябрь</h4>
                <h5>Макияж Маникюр Прическа</h5>
                {/* <div className={styles.images}>
                    {['master1', 'master2', 'master3'].map(i =>
                        <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                </div> */}
                <Link href="/apply_to_event" >
                    <span>
                        Подать заявку
                    </span>
                </Link>
            </section>
            <section className={styles.event} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                <p>
                    Василиса <br />
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                <h3>
                    Описание мероприятия, которое<br />
                    зарегал мастер на своем аккаунте.<br />
                    Бесплатно!
                </h3>
                <h4>Метро Грушевка</h4>
                <h5>Макияж Маникюр Прическа</h5>
                {/* <div className={styles.images}>
                    {['master1', 'master2', 'master3'].map(i =>
                        <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                </div> */}
                <Link href="/apply_to_event" >
                    <span>
                        Подать заявку
                    </span>
                </Link>
            </section>
            <section className={styles.event} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                <p>
                    Анжела Куш <br />
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>

                <h3>Описание мероприятия</h3>

                <h4>Метро Красный октябрь</h4>
                <h5>Макияж Ноготочки Прическа</h5>
                {/* <div className={styles.images}>
                    {['master1', 'master2', 'master3'].map(i =>
                        <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                </div> */}
                <Link href="/" style={ev}>Заявка уже есть</Link>
            </section>
        </div>
    )
}
