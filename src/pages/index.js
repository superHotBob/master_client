import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useRouter } from 'next/router'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setprofile } from '@/reduser'
import FilterServices from '@/components/filterServices'
const images = ['one', 'two', 'three', 'four', 'five', 'six']



export default function Home() {
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const [image, setImage] = useState()
  const prof = useSelector(state => state.counter.profile)
  // useEffect(() => {
  //   const audio = new Audio('/sound/new_message.mp3');
  //   audio.play();
  // }, [])

  useEffect(() => {
    setWidth(window.innerWidth > 500 ? 230 : (window.innerWidth - 40)/2)   
  }, [])
 

  
  const ref = useRef(null)
  return (
    <>
      <Head>       
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
              {[{image:'two', name:'bob1234',date:'12.03.2021'},
                {image:'three',name: 'Mercedec',date:'12.03.2021'},
                {image:'four', name:'Super1234',date:'12.03.2021'},
                {image:'six', name:"Mercedec",date:'12.03.2021'}].map(i =>
                <div onClick={()=>setImage(i)} key={i.image} style={{width: width, height: 'auto'}} >
                  <img alt={i.image} src={'image/' + i.image + '.jpg'} id={i} width={width} height="auto" />
                </div>
              )}
            </div>
            <div className={styles.images_two}>
              {[{image:'one', name:'bob1234',date:'12.03.2021'},
                {image:'four',name: 'Mercedec',date:'12.03.2021'},
                {image:'five', name:'Super1234',date:'12.03.2021'},
                {image:'six', name:"Mercedec",date:'12.03.2021'}].map(i =>
                <div key={i.image} onClick={()=>setImage(i)}   style={{width: width, height: 'auto'}}>
                 <img alt={i.image} src={'image/' + i.image + '.jpg'} id={i}  width={width} height="auto"/>
               </div>
              )}
            </div>
          </div>
        </section>
        {image ?
        <div className={styles.main__detail}>
          <div className={styles.detail}>
         
            <Image className={styles.close} src="/chevron_up.svg" onClick={()=>setImage()} alt="img" width={24} height={24}/>           
            <AliceCarousel
             mouseTracking
             autoHeight
             infinite
                     
             disableButtonsControls
             >
            <img alt={image.image} src={'image/' + image.image + '.jpg'} id={image.image}  width="100%" height="auto"/>
            <img alt={image.image} src={'image/lenta1.jpg'} id={image.image}  width="100%" height="auto"/>
            <img alt={image.image} src={'image/lenta3.jpg'} id={image.image}  width="100%" height="auto"/>
            </AliceCarousel>
            <div className={styles.master}>
              <Image alt="image" src={'image/' + image.name + '.jpg'} width={26} height={26}/>
              <span>{image.name}</span>
              <span>{image.date}</span>
            </div>
            <h5>Пилинг, шугаринг, наращивание</h5>
            <h6>
            {`Каждый из нас понимает очевидную вещь: граница
            обучения кадров требует анализа поэтапного и
            последовательного развития общества.`}
            </h6>
            <Link className={styles.toprofilemaster} href={'/master/' + image.name} >Перейти в профиль мастера</Link>
          </div>

        </div>: null}

      </main>
    </>
  )
}
