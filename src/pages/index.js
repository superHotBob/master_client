import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import position from '../../public/position.svg'
import close from '../../public/close.svg'
import Navi from '@/components/navi'
import arrow from '../../public/chevron right-small.svg'
import one from '../../public/image/one.jpg'
import two from '../../public/image/two.jpg'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>master</title>
        <meta name="description" content="Master app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>        
        <Header />
        <section className={styles.section}>
          <div className={styles.message} >
            <Image alt="Picture of the author" src={close} height={10} width={10} />
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
              Ноготочки,макияж,мас.......
            </span>
            <span>
              фильтр по услугам
            </span>
            <Link href="/">
              <Image src={arrow} />
            </Link>
          </div>
          <div className={styles.images}>
            <Image src={one}  height="auto"/>
            <Image src={two}   height="auto"/>
            <Image src={one}  height="auto"/>
            <Image src={two}   height="auto"/>
            <Image src={one}   height="auto"/>
            <Image src={two}   height="auto"/>

          </div>


        </section>




        <Navi page="home"/>







      </main>
    </>
  )
}
