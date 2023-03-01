import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import logo from '../../public/logo.svg'
import menu from '../../public/sort.svg'
import position from '../../public/position.svg'
import close from '../../public/close.svg'
import Navi from '@/components/navi'

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
        <header className={styles.header}>


          <Image alt="Picture of the author" src={logo} width={36} height={40} style={{ background: 'none' }} />
          <span>masters.</span><span>place</span>
          <Link href='/' className={styles.left__arrow}>
            <Image alt="Picture of the author" src={menu} className={styles.left__arrow} width={20} height={20} />
          </Link>

        </header>
        <section className={styles.section}>
          <div className={styles.message} >
            <Image alt="Picture of the author" src={close} height={10} width={10} />
            Masters.place показывает самые крутые и <br />
            актуальные работы мастеров в вашем городе. Вы <br />
            можете выбрать понравившуюся работу и написать<br />
            мастеру!
          </div>
          <div className={styles.city}>
            Выбрать ваш город
            <Image alt="Picture of the author" src={position}  width={20} height={20} />
          </div>


        </section>




<Navi />







      </main>
    </>
  )
}
