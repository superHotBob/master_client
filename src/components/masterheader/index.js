import styles from './masterheader.module.css'
import { useState } from 'react'
import Image from 'next/image'
import Location from '../location'
import { my_tema } from '@/data.'



export default function MasterHeader({ profile, slug }) {   
    const [gradient, color, background] = my_tema[+profile.tema].color
    const [viewText, setViewText] = useState(true)
    const [mapview, setmapview] = useState(false)
    console.log(slug)
    return (
        <>
            <section className={styles.section}>
                <div className={styles.image} style={{ background: gradient,backgroundSize: '200%' }}>                  
                    <Image
                        src={'https://masters.place/images/' + (profile?.nikname || slug) + '.jpg'}
                        alt="фото"
                        style={{ transform: 'translateY(50px)' }}
                        title='Иконка мастера'
                        height={106}
                        width={106}
                        className={styles.image_master}
                    />
                </div>
                <p className={styles.name_stars}>
                    <span >{profile?.name}</span>
                    <span className={styles.pro} style={{ background: gradient,backgroundSize: '200%' }}>MASTER</span>
                    {profile?.stars === '0.0' ? null : <span
                        className={styles.stars}
                        style={{ color: color, backgroundColor: background }}
                    >{profile?.stars}</span>}
                </p>
                <address onClick={() => setmapview(true)}>{profile?.address}</address>
                {viewText ? <span className={styles.text}>{profile?.text}</span> : null}
                <span style={{ color: color }} className={styles.view_text} onClick={() => setViewText(!viewText)}>{viewText ? 'Скрыть описание' : 'Описание'}</span>
            </section>
            {mapview ? <Location nikname={slug} loc_master={profile?.locations} close={setmapview} /> : null}
        </>
    )
}