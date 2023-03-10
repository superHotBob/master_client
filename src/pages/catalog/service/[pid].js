import Header from '@/components/header'
import { useRouter } from 'next/router'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './service.module.css'
import close from '../../../../public/close.svg'
import position from '../../../../public/position.svg'
import location from '../../../../public/location.svg'
import FilterServices from '@/components/filterServices'


const style = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA'
}
export default function Service() {
    const router = useRouter()
    const handleClick = (e) => {
        e.preventDefault()
        router.push('/')
    }
    
    const { id } = router.query
    console.log(id)
    return (
        <div className={styles.main}>
            <Header sel="/catalog" text="Мастера рядом" />
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
                <FilterServices />
                <div className={styles.master} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                    <Link href="/master/Виктория  Ченг">
                        <p>
                            Виктория  Ченг
                            <span className={styles.pro}>MASTER</span>
                            <span className={styles.stars}>4.9</span>
                        </p>
                    </Link>
                    <h4><Image alt="loc" src={location} width={15} height={15} /> Метро Красный октябрь</h4>
                    <h5>Макияж Ноготочки Прическа</h5>
                   
                </div>
                <div className={styles.master} style={{ backgroundImage: 'url(/image/profile1.jpg' }}>
                    <Link href="/master/Виктория  Ченг">
                        <p>
                            Клава Иванова
                            <span className={styles.pro}>MASTER</span>
                            <span className={styles.stars}>4.7 </span>
                        </p>
                    </Link>
                    <h4><Image alt="loc" src={location} width={15} height={15} /> Метро Красный октябрь</h4>
                    <h5>Макияж Ноготочки Прическа</h5>
                   

                </div>
            </section>
            <Navi />

        </div>



    )
}