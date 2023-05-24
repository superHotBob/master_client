import styles from './sertificats.module.css'
import { useState, useEffect } from 'react'
import useSWR from 'swr'

const url = 'https://masters-client.onrender.com'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Sertificats({nikname}) { 
    const { data, error, isLoading } = useSWR(`${url}/getsertificats?dir=${nikname}`, fetcher)
    const [image, viewImage] = useState()
    function ViewImage(a) {            
        viewImage(a)
        setTimeout(()=> {
            document.getElementById(a + 'aaa').style.top = window.scrollY + 150 + 'px'},500)
    }

    if (error) return <div>Сертификатов нет</div>
    if (isLoading) return <div>Загрузка сертификатов</div>
   
    return (
        <>
        <main className={styles.main}>
            {data?.map(i => 
                <div 
                    key={i}
                    onClick={()=>ViewImage(i)} 
                    className={styles.image} 
                    style={{ backgroundImage: "url(" + url + '/var/data/' +  nikname + '/' + i + ")" }}
                />
            )}
        </main>
        {image  ?
        <div className={styles.main__detail} >
          <div className={styles.detail} id={image + 'aaa'}>
            <h3 onClick={() => viewImage()} />
            <img
              alt="my_image"
              src={url + '/var/data/' +  nikname + '/' + image}
              width="100%"
              id={image}
              height="auto"
            />           
            {/* <h6>{tag ? tag.split('\n')[1] :
              `Без комментария`}
            </h6>            */}
          </div>
        </div> 
        : null
      }
        </>
    )
}