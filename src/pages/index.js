import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setlocation } from '@/reduser'
import FilterServices from '@/components/filterServices'
import Carousel from 'nuka-carousel/lib/carousel'
import Message from '@/components/message'
import { useGeolocated } from "react-geolocated";

const url = 'https://masters-client.onrender.com/images/'

export default function Home() {
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const [image, setImage] = useState()
 
 
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
  useGeolocated({
      positionOptions: {
          enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
  });
  useEffect(() => {
    setWidth(window.innerWidth > 500 ? 230 : (window.innerWidth - 40)/2) 
    if ( coords) { dispatch(setlocation([coords.latitude,coords.longitude])) 
    console.log(coords.latitude,coords.longitude) }
  }, [coords])
  
  return (
    <>     
      
        <Header />
        <section className={styles.section}>
          <Message text={` Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. Вы 
            можете выбрать понравившуюся работу и написать
            мастеру!` }
          />        
          <Link className={styles.city} href="/city"> Выбрать ваш город</Link>
          <FilterServices />
          {/* {coords?<span>{coords.latitude},{coords.longitude}</span> : null} */}
          <div className={styles.images}>
            <div className={styles.images_one}>
              {[{image:'two', name:'bob1234',date:'12.03.2021'},
                {image:'five',name: 'Mercedec',date:'12.03.2021'},
                {image:'four', name:'Super1234',date:'12.03.2021'},
                {image:'six', name:"Mercedec",date:'12.03.2021'}].map(i =>
                <div onClick={()=>setImage(i)} key={i.image} style={{width: width, height: 'auto'}} >
                  <img alt={i.image} src={url + i.image + '.jpg'} id={i.image} width="100%" height="auto" />
                </div>
              )}
            </div>
            <div className={styles.images_two}>
              {[{image:'one', name:'Super1234',date:'12.03.2021'},
                {image:'four',name: 'Mercedec',date:'12.03.2021'},
                {image:'three', name:'Super1234',date:'12.03.2021'},
                {image:'six', name:"Mercedec",date:'12.03.2021'}].map(i =>
                <div key={i.image} onClick={()=>setImage(i)}   style={{width: width, height: 'auto'}}>
                 <img alt={i.image} src={url + i.image + '.jpg'} id={i.image}  width="100%" height="auto"/>
               </div>
              )}
            </div>
          </div>
        </section>
        {image ?
        <div className={styles.main__detail}>
          <div className={styles.detail}>         
            <Image className={styles.close} src="/chevron_up.svg" onClick={()=>setImage()} alt="img" width={24} height={24}/>           
           <Carousel 
           adaptiveHeight 
           defaultControlsConfig={{
            nextButtonStyle: {display: 'none'},
            prevButtonStyle: {display: 'none'},
            pagingDotsClassName: styles.carousel,
            pagingDotsStyle: {            
              margin: '10px 5px',              
              display: 'inline-block',
              width: '20vw',
              maxWidth: '100px',
              borderRadius: 4,
              backgroundColor: '#3D4EEA',
              height: 5,
              
                           
            }
           }}
           >
            <img alt={image.image} src={url + image.image + '.jpg'}   width="100%" height="auto"/>
            <img alt={image.image} src={'image/lenta1.jpg'} id={image.image}  width="100%" height="auto"/>
            <img alt={image.image} src={'image/lenta3.jpg'} id={image.image}  width="100%" height="auto"/>
            <img alt={image.image} src={'image/master1.jpg'} id={image.image}  width="100%" height="auto"/>
            </Carousel>
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

     
    </>
  )
}
