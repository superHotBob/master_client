import styles from './viewimage.module.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'


export default function ViewImage({ view_image, viewImage, pid = null }) {

    const service = useSelector(state => state.counter.service)
    const [tag, setTag] = useState('')

    useEffect(() => {
        console.log(view_image)
        let new_file = view_image.image.replace('https://masters-client.onrender.com/var/data/', '')
        fetch(`${process.env.url}readtext?file=${new_file}`)
            .then(res => res.text())
            .then(res => {
                setTag(res)
                document.getElementById("main").style.top = window.scrollY + 'px'
                document.getElementById("main").style.opacity = 1
            })
            .catch(err => {

                document.getElementById("main").style.top = window.scrollY + 'px'
                document.getElementById("main").style.opacity = 1
            })
            .finally(() => {

                document.getElementById("main").style.top = window.scrollY + 'px'
                document.getElementById("main").style.opacity = 1
            })
    }, [])

    return (
        <>
            <div className={styles.main__detail} id="main">
                <div className={styles.detail}>
                    <h3 onClick={() => viewImage(false)} />
                    <img
                        alt={view_image.name}
                        src={view_image.image}
                        width="100%"
                        id={view_image.image}
                        height="auto"
                    />
                    <div className={styles.master} >
                        <Image alt="image" src={process.env.url + 'var/data/' + view_image.name + '/main.jpg'} width={26} height={26} />
                        <span>{pid || view_image.master_name}</span>
                        <span>{tag?.split('\n')[0]}</span>
                    </div>
                    {pid ? null : <h5>{service}</h5>}
                    <h6>{tag?.split('\n')[1] ?? 'Без комментария'}</h6>
                    {pid ?
                        <Link 
                           
                            className={styles.toprofilemaster} 
                            href={`/chat/messages/${view_image.name}?name=${view_image.master_name}`} 
                        >
                            Отправить сообщение мастеру
                            </Link> :
                        <Link className={styles.toprofilemaster} href={'/master/' + view_image.name} >Перейти в профиль мастера</Link>
                    }
                </div>
            </div>

        </>
    )

}