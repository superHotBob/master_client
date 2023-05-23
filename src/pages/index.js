import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setcity } from '@/reduser'
import { setlocation } from '@/reduser'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import { useGeolocated } from "react-geolocated";
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
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)
  const [view_image, viewImage] = useState({ name: '', image: '',master_name: '' })
  const [data, setdata] = useState([])
  const [tag, setTag] = useState()
  const count = useRef(0)


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
    count.current = 0
    fetch(`/api/all_masters_city_service?service=${service}&city=${city}`)
      .then(res => res.json())
      .then(data => setdata(data.map((i, index) => data[index] = { 'id': index + 1 + '','master_name': i.name, 'name': i.nikname, image: url_image + i.nikname + '/list__' + services__name[service] + '__0.jpg' })))
    return () => viewImage({ name: '', image: '', master_name: '' })
  }, [service])

  // useEffect(() => {
  //   // console.log([coords.latitude, coords.longitude])
  //   const options = {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Accept": "application/json",
  //       "Authorization": "Token " + token
  //     },
  //     body: JSON.stringify({ lat: coords?.latitude, lon: coords?.longitude })
  //   }

  //   async function Location() {
  //     await fetch(url_one, options)
  //       .then(response => response.json())
  //       .then(result => {
  //         dispatch(setcity(result.suggestions[0].data.city))
  //       })
  //       .catch(error => console.log("error", error));
  //   }
  //   city ? null : Location()
  // }, [coords])

  const imageOnError = (a) => {
    let new_data = [...data]
    const m = new_data.filter(i => i.id !== a)
    setdata([...m])
  };
  function Plus() {
    count.current = count.current + 1
    let new_arr = []
    data.filter(i=>i.id<10).forEach(i => new_arr.push({'id': i.id + count.current,'master_name': i.master_name, 'name': i.name, 'image': url_image + i.name + '/list__' + services__name[service] + '__' + count.current + '.jpg' }))
    setdata(data.concat(new_arr))
    console.log(data.concat(new_arr))
  }
  function Height(b) {
    document.getElementById(b).style.marginBottom = '10px'
    document.getElementById(b).style.opacity = 1
    document.getElementById("add__images").style.opacity = 1
  }
  function View(a, b,c) {
    viewImage({ ...view_image, name: a, image: b,master_name: c })
    GetText(b)
    setTimeout(() => {
      document.getElementById(b + a).style.top = window.scrollY + 'px'
      document.getElementById(b + a).style.opacity = 1
     
    }, 500)
  }
  function GetText(a) {
    let new_file = a.replace('https://masters-client.onrender.com/var/data/', '')
    fetch(`${url_two}readtext?file=${new_file}`)
      .then(res => res.text())
      .then(res => setTag(res))
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
        <Link className={styles.city} href="/city"> Ваш город {city}</Link>
        <FilterServices />
        <div className={styles.images}>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 === 0).map(i =>
              <img
                alt="abc"
                key={i.id}
                id={i.id}
                onClick={() => View(i.name, i.image, i.master_name)}
                onError={() => imageOnError(i.id)}
                onLoad={(img) => Height(i.id)}
                src={i.image}
                title={i.master_name}
              />
            )}
          </div>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 !== 0).map(i =>
              <img
                alt="abc"
                key={i.id}
                id={i.id}
                onClick={() => View(i.name, i.image,i.master_name)}
                onError={() => imageOnError(i.id)}
                onLoad={() => Height(i.id)}
                src={i.image}
                title={i.master_name}
              />
            )}
           
          </div>
          
        </div>
        <button id= "add__images" className={styles.add__images} onClick={Plus}>+</button>
      </section>
      {view_image.name ?
        <div className={styles.main__detail} id={view_image.image + view_image.name}>
          <div className={styles.detail}>
            <h3 onClick={() => viewImage({ name: '', image: '' })}/>          
            <img
              alt={view_image.name}
              src={view_image.image}
              width="100%"
              id={view_image.image}
              height="auto"
            />           
            <div className={styles.master} >
              <Image alt="image" src={url_image + view_image.name + '/main.jpg'} width={26} height={26} />
              <span>{view_image.master_name}</span>
              <span>{tag?.split('\n')[0]}</span>
            </div>
            <h5>{service}</h5>
            <h6>{tag ? tag.split('\n')[1] :
              `Без комментария` }
            </h6>
            <Link className={styles.toprofilemaster} href={'/master/' + view_image.name} >Перейти в профиль мастера</Link>
          </div>

        </div> : null}


    </>
  )
}
