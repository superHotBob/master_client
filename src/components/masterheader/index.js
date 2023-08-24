import styles from './masterheader.module.css'
import { useState } from 'react'
import Image from 'next/image'
import Location from '../location'
import { my_tema } from '@/data.'

const url = 'https://masters-client.onrender.com/'

export default function MasterHeader({profile,slug}) {   
    // console.log(my_tema[profile.tema].color)
    const [gradient, color, background] = my_tema[profile?.tema??0].color 
    const [viewText, setViewText] = useState(true)
    const [mapview, setmapview] = useState(false)
    return (
        <>
        <section className={styles.section}>
            <div className={styles.image} style={{ background: gradient }}>
                 <div className={styles.image_master} 
                    style={{backgroundImage: 'url(' + url + 'var/data/' + (profile?.nikname??slug) + '/main.jpg)' }}
                />

               
                {/* <Image priority={true} src={url + 'var/data/' + master + '/main.jpg'} alt="profile" height={105} width={105} />  */}
            </div>
            <p className={styles.name_stars}>
                <span >{profile?.name}</span>
                <span className={styles.pro} style={{ background: gradient }}>MASTER</span>
                {profile?.stars === '0.0' ? null : <span
                    className={styles.stars}
                    style={{ color: color, backgroundColor: background }}
                >{profile?.stars}</span>}
            </p>
            <h4 onClick={() => setmapview(true)}>{profile?.address}</h4>
            {viewText ? <h5 className={styles.text}>{profile?.text}</h5> : null}
            <span style={{ color: color }} className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
        </section>
        {mapview ? <Location nikname={profile?.nikname} loc_master={profile?.locations} close={setmapview} /> : null}
        </>
    )
}