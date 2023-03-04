import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './near.module.css'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import Script from 'next/script'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff'
}
const styleSelService = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA'
}
const masters = [{
    id: 1,
    name: 'Я мастер по имени Виктория Ченг',
    address: 'Метро грушевка',
    image: 'profile1',
    status: 'PRO',
    stars: 4,
    servises: 'Ноготочки,макияж,массаж,прически',
    coordenates: [53.88659, 27.51397]
},
{
    id: 2,
    name: 'Я мастер по имени Клава',
    address: 'Метро немига',
    image: 'profile2',
    status: 'PRO',
    stars: 4.7,
    servises: 'Ноготочки,макияж,массаж,прически',
    coordenates: [53.90624, 27.553048]
}, {
    id: 3,
    name: 'Я мастер по имени Зина',
    address: 'Проспект независимости',
    image: 'profile3',
    status: 'MASTER',
    stars: 4.9,
    servises: 'Ноготочки,макияж,массаж,прически',
    coordenates: [53.93085, 27.63899]
}
]
export default function MasterNear() {
    const my_city = useSelector((state) => state.counter.city)
    const [selector, setSelector] = useState(1)
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, SetFilter] = useState()
    function setFilter(e) {
        SetFilter(e.target.id)
    }
    const defaultState = {
        center: [53.904430, 27.554895],
        zoom: 12,
        controls: [],
        behaviors: ["default", "scrollZoom", "click"]
    };


    return (
        <div className={styles.main}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />
            <Header sel="/catalog" text="Мастера рядом " />
            <h2>{my_city}</h2>
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Список</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>На карте</span>
            </div>
            {selector ?
                <section className={styles.section}>
                    <div className={styles.main__filter}>
                        <span>Ноготочки,макияж,мас...</span>
                        <span onClick={() => setViewFilter(true)}>
                            фильтр по услугам
                        </span>
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)}>фильтр по услугам</h6>
                            <div className={styles.all__filter__data} onClick={setFilter}>
                                {['Ноготочки', 'Прически', 'Макияж', 'Масаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция'].map(i =>
                                    <b key={i} id={i} style={filter === i ? styleSelService : null}>{i}</b>)}
                            </div>
                        </div> : null}
                    </div>
                    {masters.map(i => <div key={i.id} className={styles.master}
                        style={{ backgroundImage: `url(/image/${i.image}.jpg` }}                    >
                        <p style={{ width: '75%' }}>
                            <b>{i.name}</b><br />
                            <span className={styles.pro}>{i.status}</span>
                            <span className={styles.stars}>{i.stars}</span>
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.servises}</h5>
                    </div>)}
                </section>
                :
                <section>
                    <div className={styles.main__filter}>
                        <span>Мастера в радиусе 10 км</span>
                        <span onClick={() => setViewFilter(true)}>
                            радиус поиска
                        </span>
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)}>фильтр по услугам</h6>
                            <div className={styles.all__filter__data} onClick={setFilter}>
                                {['Ноготочки', 'Прически', 'Макияж', 'Масаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция'].map(i =>
                                    <b key={i} id={i} style={filter === i ? styleSelService : null}>{i}</b>)}
                            </div>
                        </div> : null}

                    </div>
                    <YMaps>
                        <Map defaultState={defaultState} width="100%" height="75vh">                           
                            {masters.map(i => <Placemark geometry={i.coordenates} key={i.id}
                                properties={{
                                    hintContent: i.name,
                                    balloonContent: 'Это красивая метка'
                                }}
                                options={{
                                    iconLayout: 'default#image',
                                    iconImageHref: `image/${i.image}.jpg`,
                                    iconImageSize: [40, 40],
                                }} />)}
                        </Map>
                    </YMaps>
                </section>}

        </div>
    )
}