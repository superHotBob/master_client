import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef } from 'react'
import {  useSelector } from 'react-redux'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import ViewImage from '@/components/viewimage'


export default function Home() {  
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)
  const [view_image, viewImage] = useState(false)
  const [data, setdata] = useState([]) 
  
 
  const ref = useRef(null)  
  const servref = useRef(service)
  
  useEffect(()=>{ 
    // for( const i of Array(1000)) {
    //   fetch('http://masters.place:5000/ip').then(res=>res.text()).then(res=>console.log(res))
     
    // } 
    
    
    if(servref.current != service) {     
      setdata([])      
      servref.current = service
    }
    fetch(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}&limit=100&offset=${0}`)
    .then(res => res.json())
    .then(res => { 
      if(res.length > 0){
        setdata(data => ([...data,...res]))
      } else {
        return;
      }   
     
    })
  },[service])

 
 

  const View = (a, b, c, d, e) => viewImage({text: d, name: a, image: b, master_name: c , date: e})
 
  return (
    <>
     
      <section className={styles.section} >
        <Message page="main" text='Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. 
            Вы можете выбрать понравившуюся работу и 
            написать мастеру !'
        />      
        <Link className={styles.city} href="/city"> 
          Ваш город 
          <span className={styles.my_city}>{city}</span>
        </Link>
        <FilterServices />
        <div className={styles.images} id="myDiv"  ref={ref}>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 === 0).map((i,index) =>
              <img
                alt="abc"
                key={i.id}
                id={i.id}
                onClick={() => View(i.nikname, process.env.url_image +  i.id + '.jpg', i.master_name, i.review, i.img_date)}
                loading={index > 3 ? 'lazy': 'eager'}              
                src={process.env.url_image +  i.id + '.jpg' }
                title={i.master_name}
              />
            )}
          </div>
          <div className={styles.images_one}>
            {data?.filter((i, index) => index % 2 !== 0).map((i,index) =>
              <img
                alt="abc"
                key={i.id}
                id={i.id}
                onClick={() => View(i.nikname, process.env.url_image +  i.id + '.jpg', i.master_name, i.review, i.img_date)}
                loading={index > 3 ? 'lazy': 'eager'}                 
                src={process.env.url_image +  i.id + '.jpg' }
                title={i.master_name}
              />
            )}
          </div>
        </div>        
        {view_image ? 
          <ViewImage 
            service={service} 
            view_image={view_image} 
            url_image={process.env.url_image} 
            viewImage={viewImage} 
          />
        :
          null
        }
      </section>      
    </>
  )
}
