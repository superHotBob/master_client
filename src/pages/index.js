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
  const ref = useRef(null)
  const refmove = useRef(0)
  const servref = useRef(service)
 
 
  // const { data, error } = useSWR(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}&limit=6&offset=4`, fetcher)
  // if(images) {
  //   // setdata(images.map((i, index) => data[index] = { 'id': index + 1 + '', 'master_name': i.name, 'name': i.nikname, image: process.env.url + 'var/data/' + i.nikname + '/list__' + services__name[service] + '__0.jpg' }))
   
  //   // mutate({...images,nikname:newName})
  // }
  
  
  // useEffect(() => {
  //   // setdata([])   
    
  //   fetch(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}&limit=6&offset=0`)
  //   .then(res => res.json())
  //   .then(data => {      
  //     setdata(data)
  //   })
   
  // }, [service])
  const [scrollTop, setScrollTop] = useState(0);
  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     if(event.wheelDeltaY < 0 ) {
        
  //       setScrollTop(Math.floor(window.scrollY /150));
  //       refmove.current = Math.floor(window.scrollY /150)
        
  //     }
     
      
  //   };

  //   window.addEventListener('wheel', handleScroll);

  //   return () => {
  //     window.removeEventListener('wheel', handleScroll);
  //   };
  // }, []);
  useEffect(()=>{   
   
   
    if(servref.current != service) {     
      setdata([])
      setScrollTop(0)
      servref.current = service
    }
    fetch(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}&limit=100&offset=${0}`)
    .then(res => res.json())
    .then(res => { 
      if(res.length>0){
        setdata(data=>([...data,...res]))
      }  else {
        return;
      }   
     
    })
  },[scrollTop,service])

 
  function Height(b) {
    // document.getElementById(b).style.marginBottom = '10px'
    // document.getElementById(b).style.opacity = 1
    // document.getElementById("add__images").style.opacity = 1
  }

  const View = (a, b, c, d, e) => viewImage({text: d, name: a, image: b, master_name: c , date: e})
 
  return (
    <>
      <Header />
      <section className={styles.section} >
        <Message page="main" text='Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. Вы 
            можете выбрать понравившуюся работу и написать
            мастеру !'
        />      
        <Link className={styles.city} href="/city"> 
          Ваш город 
          <span className={styles.my_city}>{city}</span>
        </Link>
        <FilterServices />
        <div className={styles.images} id="myDiv"  ref={ref}>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 === 0).map(i =>
              <img
                alt="abc"
                key={i.id}
                id={i.id}
                onClick={() => View(i.nikname, process.env.url + 'var/data/' + i.nikname + '/' +  i.id + '.jpg', i.master_name, i.review, i.img_date)}
               
                onLoad={() => Height(i.id)}
                src={process.env.url + 'var/data/' + i.nikname + '/' +  i.id + '.jpg' }
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
                onClick={() => View(i.nikname, process.env.url + 'var/data/' + i.nikname + '/' +  i.id + '.jpg', i.master_name, i.review, i.img_date)}
                
                onLoad={() => Height(i.id)}
                src={process.env.url + 'var/data/' + i.nikname + '/' +  i.id + '.jpg' }
                title={i.master_name}
              />
            )}
          </div>
        </div>        
        {view_image ? <ViewImage service={service} view_image={view_image} url_image={url_image} viewImage={viewImage} />:null}
      </section>      
    </>
  )
}
