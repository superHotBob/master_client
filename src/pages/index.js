import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import ViewImage from '@/components/viewimage'
import CitySelect from '@/components/city'
import Image from 'next/image'
export default function Home() {
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)
  const [view_image, viewImage] = useState(false)
  const [data, setdata] = useState([])


  const ref = useRef(null)
  const servref = useRef(service)

  useEffect(() => {
    if (servref.current != service) {
      setdata([])
      servref.current = service
    }
    fetch(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}&limit=100&offset=${0}`)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          setdata(data => ([...data, ...res]))
        } else {
          return;
        }

      })
  }, [service])



  const viewNewImage = (e) => {
    viewImage({
      name: JSON.parse(e.target.id).nikname,
      image: process.env.url_image + JSON.parse(e.target.id).id + '.jpg',
      master_name: JSON.parse(e.target.id).master_name,
      text: JSON.parse(e.target.id).review,
      date: JSON.parse(e.target.id).img_date
    })
  }

  return (
    <section className={styles.section} >
      <Message page="main" text='Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. 
            Вы можете выбрать понравившуюся работу и 
            написать мастеру !'
      />
      <CitySelect city={city} />
      <FilterServices />
      <div className={styles.images} id="myDiv" ref={ref} onClick={viewNewImage}>
        <div className={styles.images_one}>
          {data?.filter((i, index) => index % 2 === 0).map((i, index) =>
            <Image
              alt="abc"
              key={i.id}
              id={JSON.stringify(i)}
              // onClick={() => View(i.nikname, process.env.url_image + i.id + '.jpg', i.master_name, i.review, i.img_date)}
              // loading={index > 3 ? 'lazy' : 'eager'}
              src={process.env.url_image + i.id + '.jpg'}
              title={i.master_name}
              priority={true}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={500}
              height={300}
            />
          )}
        </div>
        <div className={styles.images_one}>
          {data?.filter((i, index) => index % 2 !== 0).map((i, index) =>
            <Image
              alt="abc"
              key={i.id}
              id={JSON.stringify(i)}
              // onClick={() => View(i.nikname, process.env.url_image + i.id + '.jpg', i.master_name, i.review, i.img_date)}
              // loading={index > 3 ? 'lazy' : 'eager'}
              src={process.env.url_image + i.id + '.jpg'}
              title={i.master_name}
              sizes="100vw"
              priority={true}
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={500}
              height={300}
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

  )
}
