import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setcity } from '@/reduser'
import { setlocation } from '@/reduser'
import FilterServices from '@/components/filterServices'
import Carousel from 'nuka-carousel/lib/carousel'
import Message from '@/components/message'
import { useGeolocated } from "react-geolocated";
import useSWR from 'swr'
const url_image = 'https://masters-client.onrender.com/var/data/'
const url_two = 'https://masters-client.onrender.com/'
const url_one = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address"
const token = "5ff295eebd78a454b8bd3805b29d1eb6daefe31f"

const services__name = {
  барбер: 'barber',
  прически: 'pricheski',
  массаж: 'massaj',
  маникюр: 'manikur',
  педикюр: 'pedikur',
  окрашивание: 'okrashivanie',
  чистка: 'chistka',
  стрижка: 'strijka',
  брови: 'brovi',
  ресницы: 'resnici',
  депиляция: 'depiliaciy',
  макияж: 'makiaj'
}

export default function Home() {
  const dispatch = useDispatch()
  const [view_image, viewImage] = useState({name:'',image:''})
  const [data, setdata] = useState([])
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)

  // const fetcher = (...args) => fetch(...args).then(res => res.json())
  // const { data, error, isLoading } = useSWR(`/api/all_masters_city_service?service=${service}&city=${city}`, fetcher)
  // console.log(data.map(i=>(url_two + 'var/data/' + i.nikname + '/list__' + services__name['маникюр'] + '__0.jpg')))
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  useEffect(() => {
    setdata([])
    fetch(`/api/all_masters_city_service?service=${service}&city=${city}`)
      .then(res => res.json())
      .then(data => setdata(data.map((i,index)=>data[index] = {id: index,'name': i, image: url_image + i + '/list__' + services__name[service] + '__0.jpg'})))

  }, [service])

  useEffect(() => {
    // console.log([coords.latitude, coords.longitude])
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
      },
      body: JSON.stringify({ lat: coords?.latitude, lon: coords?.longitude })
    }

    async function Location() {
      await fetch(url_one, options)
        .then(response => response.json())
        .then(result => {
          dispatch(setcity(result.suggestions[0].data.city))

        })
        .catch(error => console.log("error", error));
    }
    Location()
  }, [coords])

  const imageOnError = (a) => {  
    console.log(a)
    data.filter(i => { return i.name !== a })
    setdata(data.filter(i => { return i.name !== a }))
    console.log(data.filter(i => { return i.name !== a }))
  };
  function Plus() {
    let new_arr = data
    data.forEach(i => new_arr.push({name:i.name,image:i.image.replace('0.jpg','1.jpg')}))
    setdata([...new_arr])
    console.log(new_arr)
  }

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
        <div className={styles.images}>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 === 0).map((i, index) =>
              <div onClick={() => viewImage({...view_image,name:i.name,image: i.image})}  key={i.index}>
                <img
                  alt="abc"
                  onError={() => imageOnError(i)}
                  src={i.image}
                  title={i.name}
                />
              </div>
            )}
          </div>
          <div className={styles.images_two}>
            {data?.filter((i, index) => index % 2 !== 0).map(i =>
              <div onClick={() => viewImage({...view_image,name:i.name,image: i.image})}  key={i.index}>
                <img
                  alt="abc"
                  onError={() => imageOnError(i.name)}
                  src={i.image}
                  title={i.name}
                />
              </div>
            )}
            <button className={styles.add__images} onClick={Plus}>+</button>
          </div>
        </div>
      </section>
      {view_image.name ?
        <div className={styles.main__detail}>
          <div className={styles.detail}>
            <Image className={styles.close} src="/chevron_up.svg" onClick={() => viewImage({name:'',image:''})} alt="img" width={24} height={24} />
            {/* <Carousel
              adaptiveHeight
              defaultControlsConfig={{
                nextButtonStyle: { display: 'none' },
                prevButtonStyle: { display: 'none' },
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
            > */}
            <img alt={view_image.image} src={view_image.image} width="100%" height="auto" />
            {/* <img alt={image.image} src={'image/lenta1.jpg'} id={image.image} width="100%" height="auto" />
              <img alt={image.image} src={'image/lenta3.jpg'} id={image.image} width="100%" height="auto" />
              <img alt={image.image} src={'image/master1.jpg'} id={image.image} width="100%" height="auto" /> */}
            {/* </Carousel> */}
            <div className={styles.master}>
              <Image alt="image" src={url_image + view_image.name + '/main.jpg'} width={26} height={26} />
              <span>{view_image.name}</span>
              <span></span>
            </div>
            <h5>Пилинг, шугаринг, наращивание</h5>
            <h6>
              {`Каждый из нас понимает очевидную вещь: граница
            обучения кадров требует анализа поэтапного и
            последовательного развития общества.`}
            </h6>
            <Link className={styles.toprofilemaster} href={'/master/' + view_image.name} >Перейти в профиль мастера</Link>
          </div>

        </div> : null}


    </>
  )
}
