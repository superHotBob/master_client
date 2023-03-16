import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'
import FilterServices from '@/components/filterServices'

const images = ['one', 'two', 'three', 'four', 'five', 'six']



export default function Home() {
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const prof = useSelector(state => state.counter.profile)
  // useEffect(() => {
  //   const audio = new Audio('/sound/new_message.mp3');
  //   audio.play();
  // }, [])

  useEffect(() => {
    setWidth(window.innerWidth > 500 ? 230 : (window.innerWidth - 40)/2) 
    
    let profile = JSON.parse(localStorage.getItem("profile"))
    if (!prof.status) {
      dispatch(setprofile(profile))
    }
  }, [])
 

  
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
            <div className={styles.images_one}>
              {['two', 'three', 'four', 'six'].map((i, index) =>
                <Link href="/" key={i} style={{width: width, height: 'auto'}} >
                  <img alt={i} src={'image/' + i + '.jpg'} id={i} width={width} height="auto" />
                </Link>
              )}
            </div>
            <div className={styles.images_two}>
              {['one', 'four', 'five', 'six'].map((i, index) =>
                <Link href="/" key={i} style={{width: width, height: 'auto'}}>
                 <img alt={i} src={'image/' + i + '.jpg'} id={i}  width={width} height="auto"/>
               </Link>
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
