import styles from './lenta.module.css'
import Link from 'next/link'
import Image from 'next/image'
import arrow_down from '../../../public/arrow_down.svg'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import useSWR from 'swr'
import ViewImage from '../viewimage'
import { My_Date } from '@/profile'

export default function Lenta({ color= ['linear-gradient(to left, #3D4EEA, #5E2AF0)', '#3D4EEA', '#ECEEFD'], nikname, name }) {
    
    const [model, setViewText] = useState(false)
    const [view_image, viewImage] = useState(false)
    const [message, setMessage] = useState(false)
    const profile = useSelector(state => state.counter.profile)

    const { data: image } = useSWR(view_image ? null : `/api/get_images?nikname=${nikname}`)
    const { data: events } = useSWR(view_image ? null : `/api/get_events_master?nikname=${nikname}`)
   
   

    function Saved_image(a) {        
        let pro = JSON.parse(localStorage.getItem('profile'))
        let new_saved = [...pro.saved_image]
        const add_image = [...new_saved, a]
        fetch('/api/saves_image', {
            body: JSON.stringify({ image: add_image, nikname: profile.nikname }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res => {
            setMessage(true)
            const new_profile = { ...profile, saved_image: add_image }
            localStorage.setItem('profile', JSON.stringify(new_profile))
            setTimeout(() => setMessage(false), 3000)
        })
    }
    const ViewImageClick = (a) => {          
        viewImage({ 
            name: a.nikname, 
            image: process.env.url_image + nikname + '/' + a.id + '.jpg', 
            master_name: name ,
            date: a.img_date,
            text: a.review,
            service: a.service
        })
    }

    return ( <>
        {events ? <>
        {Object.keys(events).length ? <div onClick={() => setViewText(true)} className={styles.model} style={{ background: color[1] }}>
            <h3>Нужна модель</h3>
            <span>{My_Date(events.date_event)}, бесплатно</span>
        </div> : null}</>
        : null}
        <dialog open={message} className={styles.message}>
            Изображение сохранено
        </dialog>
        <div className={styles.images}>
            <div className={styles.part_images}>
                {image?.filter((i, index) => index % 2 === 0).map(i =>
                    <div key={i.id}>
                        <img alt="image" onClick={() => ViewImageClick(i)} 
                        src={process.env.url_image + nikname + '/' + i.id + '.jpg'} />
                        {profile.status === 'client' ?
                            <span
                                className={styles.save__image}
                                onClick={() => Saved_image(i.id)}
                            /> : null}
                    </div>
                )}
            </div>
            <div className={styles.part_images}>
                {image?.filter((i, index) => index % 2 !== 0).map(i =>
                    <div key={i.id}>
                        <img alt="image" onClick={() => ViewImageClick(i)} 
                        src={process.env.url_image + nikname + '/' + i.id + '.jpg'} />
                        {profile.status === 'client' ?
                            <span
                                className={styles.save__image}
                                onClick={() => Saved_image(i.id)}
                            /> : null}
                    </div>
                )}
            </div>

        </div>
        {model ?
            <div className={styles.need_model_main}>
                <div className={styles.need_model_data}>
                    <Image alt="arrow" src={arrow_down} height={20} width={20} onClick={() => setViewText(false)} />
                   
                    <h4>Нужна модель бесплатно</h4>
                    <h4 className={styles.date}>{My_Date(events.date_event)}</h4>
                    <p className={styles.text}>{events.event_text}</p>
                    {profile.status === 'client' ? <Link href="/" className={styles.add}>Подать заявку</Link>: null}
                </div>
            </div>
            : null}
        {view_image ? <ViewImage view_image={view_image} viewImage={viewImage}  pid={name} /> : null}

    </>) 
}