import Header from '@/components/header'
import Image from 'next/image'
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
    fontWeight: 600
}

const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"

export default function MasterNear() {
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const [viewRange, setViewRange] = useState(false)
    const [zoom, setZoom] = useState(11)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()

    const [veiw_select, set_view_select] = useState(false)

    const [radius, setRadius] = useState(10)
    const [mapHeight, setMapHeight] = useState()
   
    console.log('radius', radius)

    useEffect(() => {
        console.log(window.innerHeight - document.getElementById('my_map').getBoundingClientRect().top)
        setMapHeight(window.innerHeight - document.getElementById('my_map').getBoundingClientRect().top - 25)
    }, [mapHeight])

    return (
        <div className={styles.main_city}>
            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message page="masternear" text='Masters.place позволяет познакомиться  с 
                    мастерами вашего города. Для этого нужно выбрать 
                    ваш город, что бы увидеть список мастеров.
                ' />
            </div>
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>
            <div className={styles.selector}>
                <Link href={`/masternear/${service}`}>Список</Link>
                <Link href="/masternear/city" style={sel}>На карте</Link>
            </div>
            <div className={styles.main__filter}>
                {viewRange ? null : <>
                    <span>Мастера в радиусе {radius} км</span>
                    <span onClick={() => setViewRange(true)}>радиус поиска</span>
                </>}
                {viewRange ? <div className={styles.all__filter}>
                    <h6 onClick={() => setViewRange(false)} />
                    <p>{radius} км</p>
                    <input
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
                    />

                </div> : null}
            </div>
            <div className={styles.my_map} id="my_map" style={{ minHeight: mapHeight }}>
                <YMaps query={{ apikey: API_KEY }}>
                    {mapHeight &&
                    <MapComponent
                        setRadius={setRadius}
                        set_view_select={set_view_select}
                        master={master}
                        my_zoom={zoom}
                        masters={masters}
                        setzoom={setZoom}
                        divHeight={mapHeight}
                    />}
                </YMaps>
               
            </div>
        </div>
    )
}