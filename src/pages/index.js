import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navi from '@/components/navi'
import Header from '@/components/header'
import { useRouter } from 'next/router'
import { useState } from 'react'
import FilterServices from '@/components/filterServices'



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  

 

  const router = useRouter()
  
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/')
  }

  
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
            Masters.place показывает самые крутые и <br />
            актуальные работы мастеров в вашем городе. Вы <br />
            можете выбрать понравившуюся работу и написать<br />
            мастеру!
          </div>
          <Link className={styles.city} href="/city"> Выбрать ваш город</Link>
          <FilterServices />
          <div className={styles.images}>
            {['one', 'two', 'three', 'four', 'five', 'six'].map((i, index) =>
              <Link href="/" key={i} style={{ backgroundImage: `url(/image/${i}.jpg)` }} />)}
          </div>
        </section>




        <Navi page="home" />







      </main>
    </>
  )
}
