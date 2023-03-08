import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './near.module.css'
import arrow_down from '../../../public/arrow_down.svg'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import Script from 'next/script'
import FilterServices from '@/components/filterServices'


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
    name: 'Виктория Ченг',
    address: 'Метро грушевка',
    image: 'profile1',
    status: 'PRO',
    stars: 4,
    servises: 'Ноготочки,макияж,массаж,прически',
    coordenates: [53.88659, 27.51397]
},
{
    id: 2,
    name: 'Клава',
    address: 'Метро немига',
    image: 'profile2',
    status: 'PRO',
    stars: 4.7,
    servises: 'Ноготочки,макияж,массаж,прически',
    coordenates: [53.90624, 27.553048]
}, {
    id: 3,
    name: 'Зина',
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
    const [filter, setFilter] = useState(10)
    const [master, selectMaster] = useState()

    const defaultState = {
        center: [53.904430, 27.554895],
        zoom: filter * 1.2,
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"]
    };
    function ViewMaster(a) {
        selectMaster(a)
    }   
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
                    <FilterServices />
                    {masters.map(i => <Link key={i.id} className={styles.master}
                        style={{ backgroundImage: `url(/image/${i.image}.jpg` }}       href={`/master/${i.name}`}             >
                        <p style={{ width: '75%' }}>
                            <b>{i.name}</b><br />
                            <span className={styles.pro}>{i.status}</span>
                            <span className={styles.stars}>{i.stars}</span>
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.servises}</h5>
                    </Link>)}
                </section>
                :
                <section>
                    {master ? null : <div className={styles.main__filter}>
                        <span>Мастера в радиусе {filter} км</span>
                        <span onClick={() => setViewFilter(true)}>
                            радиус поиска
                        </span>
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)}>радиус поиска</h6>
                            <div className={styles.all__filter__data}>
                                {[1, 3, 5, 10].map(i =>
                                    <b onClick={()=>setFilter(i)} key={i} id={i} style={filter === +i ? styleSelService : null}>{i}км</b>)}
                            </div>
                            
                        </div> : null}
                    </div>}
                    <YMaps>
                        <Map id="mymap"
                            options={{ set: defaultState }}
                           
                            state={{
                                center: master ? masters.filter(i => i.name === master)[0].coordenates : [53.904430, 27.554895],
                                zoom: master ? 14 : 10 + 10 / filter * 0.8,
                                controls: [],
                                behaviors: ["default", "scrollZoom"]
                            }} width="100%" height={master ? "30vh" : "75vh"} >
                            {masters.map(i => <Placemark geometry={i.coordenates} key={i.id}
                                properties={{
                                    hintContent: i.name,
                                    balloonContent: 'Это красивая метка',
                                    iconColor: 'green'
                                }}
                                options={{
                                    iconLayout: 'default#image',
                                    iconImageHref: filter < 5 ? `image/${i.image}.jpg` : '/master1.svg',
                                    iconImageSize: [40, 40],
                                }}
                                onClick={(e) =>( ViewMaster(i.name),console.log('this is coords',e.getZoom()))}
                            />)}
                        </Map>
                    </YMaps>
                </section>}
            {master && !selector ? <section className={styles.section}>
                <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={() => selectMaster()} />
                {masters.filter(i => i.name === master).map(i => <Link key={i.id} className={styles.master}
                    style={{ backgroundImage: `url(/image/${i.image}.jpg` }} href={`/master/${i.name}`}                  >
                    <p style={{ width: '75%' }}>
                        <b>{i.name}</b><br />
                        <span className={styles.pro}>{i.status}</span>
                        <span className={styles.stars}>{i.stars}</span>
                    </p>
                    <h4>{i.address}</h4>
                    <h5>{i.servises}</h5>
                </Link>)}
            </section> : null}

        </div >
    )
}