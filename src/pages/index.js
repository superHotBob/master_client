import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Navi from '@/components/navi'
import Header from '@/components/header'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'
import FilterServices from '@/components/filterServices'



const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const dispatch = useDispatch()
  const prof = useSelector(state=>state.counter.profile)
  useEffect(() => {
    const audio = new Audio('/sound/new_message.mp3');
    audio.play();
  }, [])
  
  useEffect(() => {
    let profile = JSON.parse(localStorage.getItem("profile"));
    dispatch(setprofile(profile))
    console.log('profile',profile)
    console.log('prof', prof)
  }, [])

  const router = useRouter()
  const ref = useRef(null)
  return (
    <>
      <Head>
        <title>master</title>
        <meta name="description" content="Master app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} ref={ref}>
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
