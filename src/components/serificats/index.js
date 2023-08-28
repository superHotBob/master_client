import styles from './sertificats.module.css'
import { useState, useEffect } from 'react'
import useSWR from 'swr'

const url = 'https://masters-client.onrender.com'


export default function Sertificats({ nikname , nav}) {
  const { data, error, isLoading } = useSWR(nav === 2 ? `${url}/getsertificats?dir=${nikname}`: null)
  const [image, viewImage] = useState()
  const [tag, setTag] = useState()



  function viewBigImage(a) {
    viewImage(a)
   
  }
  function GetText(a) {
    let new_file = nikname + '/' + a.replace('https://masters-client.onrender.com/var/data/', '')
    fetch(`${url}/readtext?file=${new_file}`)
      .then(res => res.text())
      .then(res => setTag(res))
  }

  if (error) return <div>Сертификатов нет</div>
  if (isLoading) return <h4 className={styles.upload_message}>Загрузка сертификатов...</h4>

  return (
    <>
      <div className={styles.sertificat_main}>
        {data?.map(i =>
          <img
            key={i}
            alt="image"
           
            onClick={() => {
              viewBigImage(i)
              GetText(i)
            }}
            className={styles.image}
            src={url + '/var/data/' + nikname + '/' + i  }
          />
        )}
      </div>
      {image ?
        <div className={styles.main__detail} >
          <div className={styles.detail} id={image + 'aaa'}>
            <h3 onClick={() => viewBigImage()} />
            <img
              alt="my_image"
              src={url + '/var/data/' + nikname + '/' + image}
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