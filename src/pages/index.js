import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef, Fragment } from 'react'
import { useSelector } from 'react-redux'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import ViewImage from '@/components/viewimage'
import CitySelect from '@/components/city'
import Image from 'next/image'
import Head from 'next/head'



export default function Home() {
  const service = useSelector(state => state.counter.service)
  const city = useSelector(state => state.counter.city)
  const [view_image, viewImage] = useState(false)
  const [data, setdata] = useState({})

  const [view, setview] = useState(2)

  const ref = useRef(null)
  const servref = useRef(service)
  const view_ref = useRef(2)

  function handleScroll() {
    setview(view_ref.current)
    if (ref.current?.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight) {
      view_ref.current = view_ref.current + 1
    }
  };

  useEffect(() => {   
    if (ref.current.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight) {
      setview(3)
      view_ref.current = view_ref.current + 1
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  useEffect(() => {
    if (servref.current != service) {
      setdata([])
      servref.current = service
    }
    fetch(`/api/get_images_master_city?service=${service}&city=${city.toLowerCase()}`)
      .then(res => res.json())
      .then(res => {
        if (res['one']) {
          setdata(res)
        } else {
          return;
        }
      })
  }, [service])



  const viewNewImage = (e) => {
  
    if(e.target.id) {
      const rating = document.getElementById(e.target.id).height/document.getElementById(e.target.id).width
      console.log(rating)
      viewImage({
        name: JSON.parse(e.target.id).nikname,
        image: process.env.url_image + JSON.parse(e.target.id).id + '.jpg',
        master_name: JSON.parse(e.target.id).master_name,
        text: JSON.parse(e.target.id).review,
        date: JSON.parse(e.target.id).img_date,
        rating: rating
      })
    }
  }

  return (<>
  <Head>
    <title>Лучшие мастера маникюра , причёски, макияжа , массажа в вашем городе</title>
  </Head>
    <section className={styles.section} >
      <Message page="main" text='Masters.place показывает самые крутые и 
            актуальные работы мастеров в вашем городе. 
            Вы можете выбрать понравившуюся работу и 
            написать мастеру !'
      />
      <CitySelect city={city} />
      <FilterServices />
      <div className={styles.images} id="myDiv" ref={ref} onClick={viewNewImage} >
        <div className={styles.images_one}>
          {data['one']?.map((i, index) =>
            <Fragment key={i.id}>
              {index < view ? <Image
                alt="abc"

                id={JSON.stringify(i)}
                // onClick={() => View(i.nikname, process.env.url_image + i.id + '.jpg', i.master_name, i.review, i.img_date)}
                loading='lazy'
                src={process.env.url_image + i.id + '.jpg'}
                title={i.master_name}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                width={500}
                height={300}
              /> : null}
            </Fragment>
          )}
        </div>
        <div className={styles.images_one}>
          {data['two']?.map((i, index) =>
            <Fragment key={i.id}>
              {index < view ? <Image
                alt="abc"
                key={i.id}
                id={JSON.stringify(i)}
                // onClick={() => View(i.nikname, process.env.url_image + i.id + '.jpg', i.master_name, i.review, i.img_date)}
                loading='lazy'
                src={process.env.url_image + i.id + '.jpg'}
                title={i.master_name}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                width={500}
                height={300}
              /> : null}
            </Fragment>
          )}
        </div>
      </div>
    </section>
    {view_image &&
    <ViewImage
      service={service}
      view_image={view_image}
      url_image={process.env.url_image}
      viewImage={viewImage}
    />}
    </>
  

  )
}
