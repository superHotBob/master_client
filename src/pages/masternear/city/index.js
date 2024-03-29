import Header from '@/components/header'
import Link from 'next/link'
import styles from './near.module.css'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { YMaps } from '@pbe/react-yandex-maps'


import Message from '@/components/message'
import MapComponent from '@/components/map'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 500,
    cursor: 'default'
}

const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"

export default function MasterNear() {
    const { service, mystate } = useSelector(state => state.counter)

    const [viewRange, setViewRange] = useState(false)
    const [zoom, setZoom] = useState(11)
    const [radius, setRadius] = useState(10)
    const [mapHeight, setMapHeight] = useState()


    useEffect(() => {
        setMapHeight(window.innerHeight - document.getElementById('my_map').getBoundingClientRect().top)
    }, [])

    return (
        <>
            <Header sel="/" text="Мастера рядом" />
            <Message page="masternear" text='Masters.place позволяет познакомиться  с 
                мастерами вашего города. Для этого нужно выбрать 
                ваш город, что бы увидеть список мастеров.
            ' />
            <Link className={styles.city} href='/states'>
                {mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}
            </Link>
            <Link className={styles.selector_one} href={`/masternear/${service}`}>Список</Link>
            <span className={styles.selector_two} style={sel}>На карте</span>
            <div className={styles.main__filter}>
                {!viewRange && <>
                    <span>Мастера в радиусе {+radius > 1 ? (+radius).toFixed(0) : radius } км</span>
                    <span onClick={() => setViewRange(true)}>радиус поиска</span>
                </>}
                {viewRange ? <div className={styles.all__filter}>
                    <h6 onClick={() => setViewRange(false)} >радиус поиска</h6>
                    <div className={styles.buttons}>
                        <button onClick={()=>setZoom(zoom > 5 ? zoom + 1 : 5)} > - </button>
                        <p>{+radius > 1 ? (+radius).toFixed(0) : radius } км</p>
                        <button onClick={()=>setZoom(zoom - 1)} >+</button>
                    </div>
                    {/* <input
                        className={styles.range}
                        step="1"
                        type="range"
                        value={radius}
                        min="1"
                        max="11"
                        onChange={e => {
                            setZoom(20 - e.target.value),
                            setRadius(e.target.value)
                        }}
                    /> */}

                </div> : null}
            </div>
            <div className={styles.my_map} id="my_map">
                <YMaps query={{ apikey: API_KEY }}>
                    {mapHeight &&
                        <MapComponent
                            setRadius={setRadius}
                            my_zoom={zoom}
                            radius={radius}
                            setzoom={setZoom}
                            divHeight={mapHeight}
                        />
                    }
                </YMaps>
            </div>
        </>
    )
}