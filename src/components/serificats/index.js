import styles from './sertificats.module.css'
import { useState, useEffect } from 'react'
import useSWR from 'swr'


export default function Sertificats({ nikname , nav}) {
  const { data, isLoading } = useSWR(nav === 2 ? `/api/get_sertificats?nikname=${nikname}`: null)
  const [image, viewImage] = useState()
  const [tag, setTag] = useState()


  function viewBigImage(a) {
    if(!a) {
      return viewImage()
    }
    viewImage(a['id'])
    setTag(a['review'])
    console.log(a)
  }
 

  if (data?.length === 0) return <h4 className={styles.upload__message}>Сертификатов нет</h4>
  if (isLoading) return <h4 className={styles.upload__message}>Загрузка сертификатов...</h4>

  return (
    <>
      <div className={styles.sertificat_main}>
        {data?.map(i =>
          <img
            key={i.id}
            alt="image"           
            onClick={() => viewBigImage(i)}
            className={styles.image}
            src={process.env.url_image + i.id + '.jpg' }
          />
        )}
      </div>
      {image ?
        <div className={styles.main__detail} >
          <div className={styles.detail} id={image + 'aaa'}>
            <h3 onClick={() => viewBigImage(false)} />
            <img
              alt="my_image"
              src={process.env.url_image + image + '.jpg' }
              width="100%"
              id={image}
              height="auto"
            />
            <h6>{tag ? tag :
              `Без комментария`}
            </h6>
          </div>
        </div>
        : null
      }
    </>
  )
}