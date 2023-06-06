import arrow from '../../../../public/arrow_back_bold.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import  styles  from '../information.module.css' 
export default function Aboutservice() {
    const router = useRouter()
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>О сервисе</h4>
                <h4 onClick={()=>router.push("/")}>Закрыть</h4>
            </header>
            <section className={styles.links}>
                <h3>О сервисе</h3>

            </section>

        </main>
    )
}