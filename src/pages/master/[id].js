import { useRouter } from 'next/router'
import styles from './master.module.css'
import Image from 'next/image'
import stroke from '../../../public/stroke.svg'
import sort from '../../../public/sort.svg'
import Link from 'next/link'
import Header from '@/components/header'

const Master = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <div className={styles.main}>
            <Header text={id} sel="/masternear" />
            <section className={styles.section}>
                <div className={styles.image}>
                    <Image src='/image/profile1.jpg' alt="profile" height={105} width={105} />
                </div>
                <p>
                    <b>{id}</b>
                    <span className={styles.pro}>MASTER</span>
                    <span className={styles.stars}>4.7</span>
                </p> 
                <span className={styles.text}>Мастер миникюра с 2022 года. Обучалась в УЦ Оле Хаус, 
                    Пластек, Beautix, Luxio. Прошла курсы. Мастер 
                    миникюра с 2022 года. 
                    Обучалась в УЦ Оле Хаус, Пластек, 
                    Beautix, Luxio. Прошла курсы
                </span>       

            </section>

        </div>
    )

}

export default Master