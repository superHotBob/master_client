import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import position from '../../public/position.svg'
import close from '../../public/close.svg'
import Navi from '@/components/navi'
import Header from '@/components/header'
import { useRouter } from 'next/router'
import { useState } from 'react'

const style = {
  color: '#fff',
  padding: '0 10px',
  backgroundColor: '#3D4EEA',
  border: '1.5px solid #3D4EEA'
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <div className={styles.message} style={{ backgroundImage: 'url(close.svg)' }}>
            Masters.place показывает самые крутые и <br />
            актуальные работы мастеров в вашем городе. Вы <br />
            можете выбрать понравившуюся работу и написать<br />
            мастеру!
          </div>
          <Link className={styles.city} href="/city"> Выбрать ваш город</Link>
          <div className={styles.main__filter}>
            <span>Ноготочки,макияж,мас...</span>
            <span onClick={() => setViewFilter(true)}>
              фильтр по услугам
            </span>
            {viewFilter ? <div className={styles.all__filter}>
              <h6 onClick={() => setViewFilter(false)}>фильтр по услугам</h6>
              <div className={styles.all__filter__data} onClick={setFilter}>
                {['Ноготочки', 'Прически', 'Макияж', 'Масаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция'].map(i =>
                  <b key={i} id={i} style={filter === i ? style : null}>{i}</b>)}
              </div>
            </div> : null}
          </div>
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
