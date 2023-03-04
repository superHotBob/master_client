import Header from '@/components/header'
import { useRouter } from 'next/router'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './service.module.css'
import close from '../../../../public/close.svg'
import position from '../../../../public/position.svg'
import arrow from '../../../../public/arrow_right.svg'
import star from '../../../../public/star-small.svg'
import location from '../../../../public/location.svg'


const style = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA'
}
export default function Service() {
    const router = useRouter()
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, SetFilter] = useState()
    const handleClick = (e) => {
        e.preventDefault()
        router.push('/')
    }

    function setFilter(e) {
        SetFilter(e.target.id)
    }
    const { id } = router.query
    console.log(id)
    return (
        <div className={styles.main}>
            <Header sel="1" text="Мастера рядом" />
            <section className={styles.section}>
                <div className={styles.message} >
                    <Image alt="picture" src={close} height={10} width={10} />
                    Masters.place показывает самые крутые и <br />
                    актуальные работы мастеров в вашем городе. Вы <br />
                    можете выбрать понравившуюся работу и написать<br />
                    мастеру!
                </div>
                <div className={styles.city}>
                    <Link href="/city"> Выбрать ваш город</Link>
                    <Image alt="Picture of the author" src={position} width={20} height={20} />
                </div>
                <div className={styles.main__filter}>
                    <span>
                        Ноготочки,макияж,мас...
                    </span>
                    <span onClick={() => setViewFilter(true)}>
                        фильтр по услугам
                        <Image src={arrow} alt='arrow' />
                    </span>
                    {viewFilter ? <div className={styles.all__filter}>
                        <span>фильтр по услугам
                            <Image alt="close" style={{ margin: '8px 0 0 10px' }} src={close} height={10} width={10} onClick={() => setViewFilter(false)} />
                        </span>
                        <div className={styles.all__filter__data} onClick={setFilter}>
                            {['Ноготочки', 'Прически', 'Макияж', 'Масаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция'].map(i =>
                                <b key={i} id={i} style={filter === i ? style : null}>{i}</b>)}
                        </div>
                    </div> : null}
                </div>
                <div className={styles.master} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                    <p>
                        <b>Виктория  Ченг</b>
                        <span className={styles.pro}>PRO</span>
                        <span className={styles.stars}>4.7</span>
                    </p>
                    <h4><Image alt="loc" src={location} width={15} height={15} /> Метро Красный октябрь</h4>
                    <h5>Макияж, Ноготочки, Прическа</h5>
                    <div className={styles.images}>
                        {['master1', 'master2', 'master3'].map(i =>
                            <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                    </div>

                </div>
                <div className={styles.master} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                    <p>
                        <b>Виктория  Ченг</b>
                        <span className={styles.pro}>PRO</span>
                        <span className={styles.stars}>4.7 </span>
                    </p>
                    <h4><Image alt="loc" src={location} width={15} height={15} /> Метро Красный октябрь</h4>
                    <h5>Макияж, Ноготочки, Прическа</h5>
                    <div className={styles.images}>
                        {['master1', 'master2', 'master3'].map(i =>
                            <Image alt={i} key={i} src={'/image/' + i + '.jpg'} width={105} height={105} />)}

                    </div>

                </div>
            </section>
            <Navi />

        </div>



    )
}