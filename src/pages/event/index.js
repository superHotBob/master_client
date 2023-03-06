import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './event.module.css'

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
                    <b>Анжела Солнцепек</b><br />
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                <h3>
                    Описание мероприятия, которое<br />
                    зарегал мастер на своем аккаунте.<br />
                    Бесплатно!
                </h3>
                <h4>Метро Красный октябрь</h4>
                <h5>Макияж, Маникюр, Прическа</h5>
                <div className={styles.images}>
                    {['master1', 'master2', 'master3'].map(i =>
                        <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                </div>
                <Link href="/apply_to_event" >Подать заявку</Link>
            </section>
            <section className={styles.event} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                <p>
                    <b style={{marginRight: 10}}>Анжела Куш</b>
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p>
                <br/>
                <h3>Описание мероприятия</h3>
               
                <h4>Метро Красный октябрь</h4>
                <h5>Макияж, Ноготочки, Прическа</h5>
                <div className={styles.images}>
                    {['master1', 'master2', 'master3'].map(i =>
                        <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                </div>
                <Link href="/" style={ev}>Заявка уже есть</Link>
            </section>
        </div>
    )
}
