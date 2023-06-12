import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import Header from '@/components/header'
import { useEffect, useState, useRef } from 'react'
import {  useSelector } from 'react-redux'

import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import ViewImage from '@/components/viewimage'
const url_image = 'https://masters-client.onrender.com/var/data/'
// const url_one = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address"
// const token = "5ff295eebd78a454b8bd3805b29d1eb6daefe31f"

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
  
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)
  const [view_image, viewImage] = useState(false)
  const [data, setdata] = useState([])
 
  const count = useRef(0)


  
  useEffect(() => {
    setdata([])
    count.current = 0
    fetch(`/api/all_masters_city_service?service=${service}&city=${city.toLowerCase()}`)
    .then(res => res.json())
    .then(data => setdata(data.map((i, index) => data[index] = { 'id': index + 1 + '', 'master_name': i.name, 'name': i.nikname, image: url_image + i.nikname + '/list__' + services__name[service] + '__0.jpg' })))
  
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
  const Plus = () => {
    count.current = count.current + 1
    let new_arr = []
    data.filter(i => i.id < 10).forEach(i => new_arr.push({ 'id': i.id + count.current, 'master_name': i.master_name, 'name': i.name, 'image': url_image + i.name + '/list__' + services__name[service] + '__' + count.current + '.jpg' }))
    setdata(data.concat(new_arr))    
  }
  function Height(b) {
    // document.getElementById(b).style.marginBottom = '10px'
    document.getElementById(b).style.opacity = 1
    document.getElementById("add__images").style.opacity = 1
  }

  const View = (a, b, c) => viewImage({ name: a, image: b, master_name: c })
 
  return (
    <>
      <Header />
      <section className={styles.section}>
        <Message text='Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. Вы 
            можете выбрать понравившуюся работу и написать
            мастеру !'
        />
        <Link className={styles.city} href="/city"> 
          Ваш город 
          <span className={styles.my_city}>{city}</span>
        </Link>
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
                // onLoad={() => Height(i.id)}
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
                onClick={() => View(i.name, i.image, i.master_name)}
                onError={() => imageOnError(i.id)}
                // onLoad={() => Height(i.id)}
                src={i.image}
                title={i.master_name}
              />
            )}
          </div>
        </div>
        <button id="add__images" className={styles.add__images} onClick={Plus}>+</button>
        {view_image ? <ViewImage  view_image={view_image} url_image={url_image} viewImage={viewImage} />:null}
      </section>      
    </>
  )
}
