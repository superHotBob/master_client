import styles from './masterheader.module.css'
import { useState } from 'react'
import Image from 'next/image'
import Location from '../location'

const url = 'https://masters-client.onrender.com/'

export default function MasterHeader({profile}) {   
    const [gradient, color, background] = profile?.color || ['linear-gradient(to left, #3D4EEA, #5E2AF0)', '#3D4EEA', '#ECEEFD']
    const [viewText, setViewText] = useState(true)
    const [mapview, setmapview] = useState(false)
    return (
        <>
        <section className={styles.section}>
            <div className={styles.image} style={{ background: gradient }}>
                <Image src={url + 'var/data/' + profile.nikname + '/main.jpg'} alt="profile" height={105} width={105} /> 
            </div>
            <p className={styles.name_stars}>
                <span >{profile.name}</span>
                <span className={styles.pro} style={{ background: gradient }}>MASTER</span>
                <span
                    className={styles.stars}
                    style={{ color: color, backgroundColor: background }}
                >{profile.stars}</span>
            </p>
            <h4 onClick={() => setmapview(true)}>{profile.address}</h4>
            {viewText ? <h5 className={styles.text}>{profile.text}</h5> : null}
            <span style={{ color: color }} className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
        </section>
        {mapview ? <Location nikname={profile.nikname} loc_master={profile.locations} close={setmapview} /> : null}
        </>
    )
}