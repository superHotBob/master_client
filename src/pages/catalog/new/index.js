import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef, Fragment } from 'react'
import { useSelector } from 'react-redux'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import ViewImage from '@/components/viewimage'
import { getImage } from '../../../data.'
import Image from 'next/image'
import Head from 'next/head'
import CitySelect from '@/components/city'

export default function Home() {
  const { service, mystate } = useSelector(state => state.counter)
  const [view_image, viewImage] = useState(false)
  const [data, setdata] = useState({})
  const [view, setview] = useState(2)
  const ref_one = useRef(null)
  const ref_two = useRef(null)
  const servref = useRef(service)
  const view_ref = useRef(2)

  function handleScroll() {
    setview(view_ref.current)
    if (ref_one.current?.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight ||
        ref_two.current?.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight 
    ) {
      view_ref.current = view_ref.current + 1
    }
  };

  useEffect(() => {
    if (ref_one.current?.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight ||
        ref_two.current?.getBoundingClientRect().bottom.toFixed(0) < window.innerHeight 
    ) {
      setview(3)
      view_ref.current = view_ref.current + 1
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mystate]);

  useEffect(() => {
    if (servref.current != service) {
      setdata([])
      servref.current = service
    }
    fetch(`/api/get_images_master_city?service=${service}&city=${mystate.toLowerCase()}`)
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
    console.log(e)
    if (e.target.id) {
      const rating = document.getElementById(e.target.id).height / document.getElementById(e.target.id).width
      viewImage({
        name: JSON.parse(e.target.id).nikname,
        image: getImage(JSON.parse(e.target.id).id),
        master_name: JSON.parse(e.target.id).master_name,
        text: JSON.parse(e.target.id).review,
        date: JSON.parse(e.target.id).img_date,
        rating: rating
      })
    }
  } 
  return (
    <>
      <Head>
        <title>Лучшие мастера маникюра, причёски, макияжа, окрашивания и др. рядом с Вами</title>
      </Head>
      <Message page="main" text='Masters.place показывает самые крутые и 
        актуальные работы мастеров в вашем городе. 
        Вы можете выбрать понравившуюся работу и 
        написать мастеру!'
      />
      <CitySelect />
      <FilterServices />
      <div className={styles.images} id="myDiv"  onClick={viewNewImage}>
        <div className={styles.images_one} ref={ref_one}>
          {data['one']?.map((i, index) =>
            <Fragment key={i.id}>
              {index < view ? <Image
                alt="Изображение мастера"
                id={JSON.stringify(i)}
                loading='lazy'
                src={getImage(i.id)}
                title={i.master_name}                
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
        <div className={styles.images_one} ref={ref_two}>
          {data['two']?.map((i, index) =>
            <Fragment key={i.id}>
              {index < view ? <Image
                alt="Изображение мастера"
                key={i.id}
                id={JSON.stringify(i)}
                loading='lazy'
                src={getImage(i.id)}
                title={i.master_name}               
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

      {view_image &&
        <ViewImage
          service={service}
          view_image={view_image}
          viewImage={viewImage}
        />
      }
    </>


  )
}
