import { useRouter } from 'next/router'
import styles from './master.module.css'
import Image from 'next/image'
import stroke from '../../../public/stroke.svg'
import sort from '../../../public/sort.svg'
import Link from 'next/link'

const Master = () => {
    const router = useRouter()
    const { id } = router.query
    console.log(id)

    return (
        <div className={styles.main}>
            <header className={styles.header}>
               
                    <Link href='/' className={styles.left__arrow}>
                        <Image alt="Picture of the author" src={stroke} width={20} height={20} className={styles.left__arrow} />
                    </Link>  <span>Мой профиль</span>
                    <Link href='/' className={styles.left__arrow}>
                        <Image alt="Picture of the author" src={sort} className={styles.left__arrow} height={20} width={20}/>
                    </Link>
                    
            </header>
            <section className={styles.section}>
                <p>{id}</p>
              

            </section>

        </div>
    )

}

export default Master