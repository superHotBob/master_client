import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './near.module.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff'
}
export default function MasterNear() {
    const my_city = useSelector((state) => state.counter.city)
    const [selector, setSelector] = useState(1)
    const defaultState = {
        center: [53.904430, 27.554895],
        zoom: 12,
        controls: [],
        behaviors: ["default", "scrollZoom"]
    };


    return (
        <div className={styles.main}>
            <Header sel="/catalog" text="Мастера рядом " />
            <h2>{my_city}</h2>
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Список</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>На карте</span>
            </div>
            <YMaps>
                <Map defaultState={defaultState} width="100%" height="75vh">
                    <Placemark geometry={defaultState.center} />
                </Map>
            </YMaps>

        </div>
    )
}