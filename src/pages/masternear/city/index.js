import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import place from '../../../../public/master1.svg'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import arrow_down from '../../../../public/arrow_down.svg'
import { useSelector, useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { YMaps, Map, Placemark, Clusterer, useYMaps } from '@pbe/react-yandex-maps'
import Script from 'next/script'

import Message from '@/components/message'

const url = 'https://masters-client.onrender.com/'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
}
// const API_KEY = "05f8d2ae-bd94-4329-b9f9-7351e2ec9627"
const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"

const MapComponent = ({  setRadius, set_view_select }) => {
    const router = useRouter()
    const { pid } = router.query
    const loc = useSelector((state => state.counter.location))
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const [zoom, setZoom] = useState(11)
    const [mapHeight, setMapHeight] = useState()
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()
    const [filter_masters, setFilterMasters] = useState()
    const ymaps = useYMaps([
        "Map",
        "option.Manager",
        "option.presetStorage",
        "Placemark",
        "templateLayoutFactory",
        "coordSystem.geo",
        "Clusterer",
        "geoQuery"
    ]);

    useEffect(() => {

        if (window.innerWidth > 500) {
            setMapHeight(450)
        } else {
            setMapHeight(window.innerWidth - 50)
        }
        setMasters()
        fetch('/api/all_masters_city?' + new URLSearchParams({
            city: my_city.toLowerCase(),
            service: service ? service : pid
        }), { next: { revalidate: 100 } })
            .then(res => res.json())
            .then(data => setMasters(data))
    }, [my_city])

    useEffect(() => {
        setFilterMasters(masters)
        if (masters) {
            let mast = masters.filter(i => i.services.includes(service) ? i : null)
            setFilterMasters(mast)
        } else if (masters) {
            setFilterMasters(masters)
        } else {
        }

    }, [])



    function OnLoadMap() {
        setTimeout(() => {
            document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
            document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-copyright__link')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-map-copyrights-promo')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-gototech')[0].style.display = 'none';
            document.getElementById('my_map').style.opacity = '1';
        }, 500)
    }
    function SetFilterCluster() {
        // setMapHeight(window.innerWidth > 500 ? '350px' : window.innerWidth / 2 + 'px')
        // // setZoom(12)
        // setClusterMaster(true)
        // let filter_masters = masters.filter(i=>i.locations[0] > a[0][0] && i.locations[0] < a[1][0])
        //  console.log(Clusterer.current.getBounds())
        //  console.log(Clusterer.current.getClusters())
        const geoObjects = Clusterer.current.getGeoObjects();
        const geoObjectsQuery = Map.current.geoObjects;
        console.log(geoObjectsQuery)
        // setMasters(filter_masters)
    }
    function ViewMaster(a, b, c) {
        if (window.innerWidth > 500) {
            setMapHeight(450)
            selectMaster(a)
            setZoom(b)
        } else {
            setMapHeight(window.innerWidth - 50)
            selectMaster(a)
            setZoom(b)
        }
        set_view_select(c)

    }
    const getZoom = () => {
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            // const rightPoint = [center[0], bounds[1][1]]
            // const leftPoint = [center[0], bounds[0][0]]

            let radius = ymaps.coordSystem.geo.getDistance(
                center, bounds[1]
            )
            setRadius(Math.ceil(radius.toFixed(0) / 1000))
        }
    }
   
   console.log(masters)
  
    return (
        <>
            <Map id="mymap"
                state={{
                    center: master ? masters?.filter(i => i.nikname === master)[0].locations : loc,
                    zoom: master ? 15 : zoom,
                    behaviors: ["default", "scrollZoom", "multiTouch", "drag"]
                }}
                width="100%"
                height={master ? "30vh" : mapHeight}
                instanceRef={yamap => {
                    if (yamap) {
                        Map.current = yamap;
                    }
                }}
                onLoad={OnLoadMap}
                onWheel={() => {
                    getZoom(),
                    setZoom(Map.current.getZoom())
                }}
            >
                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false,
                        balloonPanelMaxMapArea: 'Infinity',
                        hasBallon: true,
                        zoomMargin: [60, 0, 40, 0],
                        gridSize: 128,
                        clusterIcons: [{
                            href: '/master.svg',
                            size: [40, 40],
                            offset: [0, 0],

                        }]

                    }}


                    onClick={(e) => {
                        SetFilterCluster()
                    }}

                    instanceRef={ymaps => {
                        if (ymaps) {
                            Clusterer.current = ymaps;
                        }
                    }}

                >

                    {masters?.map(i =>
                        <Placemark geometry={i.locations} key={i.nikname}
                            modules={
                                ['geoObject.addon.balloon', 'geoObject.addon.hint']
                            }

                            properties={{
                                hintContent: `<p style="border: none;color: blue;font-size: 17px;padding: 5px">${i.name}</p>`,
                                preset: "twirl#blueStretchyIcon",
                                strokeColor: 'blue'
                            }}
                            options={{
                                iconLayout: 'default#image',
                                iconImageHref: zoom > 12 ? url + 'var/data/' + i.nikname + '/main.jpg' : '/master1.svg',
                                iconImageSize: [40, 40],
                            }}
                            onClick={() => ViewMaster(i.nikname, 14, true)}

                        />)}
                </Clusterer>
            </Map>
           
            {master ?
                <section className={styles.section}>
                    <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={() => ViewMaster('', 11, false)} />
                    {masters?.filter(i => i.nikname === master).map(i =>
                        <Link key={i.nikname} className={styles.master} href={`/${i.nikname}`}
                            style={{ backgroundImage: 'url(' + url + 'var/data/' + i.nikname + '/main.jpg)' }}
                        >
                            <p style={{ width: '75%' }}>
                                <b>{i.name}</b>
                                <span className={styles.pro}>MASTER</span>
                                {i.stars != '0.0' ? <span className={styles.stars}>{i.stars}</span> : null}
                            </p>
                            <h4>{i.address}</h4>
                            <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                            {/* <Image src={url + 'var/data/' + i.nikname + '/main.jpg'} width={60} height={auto} alt="main_image" /> */}
                        </Link>)}
                </section> : null}
        </>
    );
};




export default function MasterNear() {

    // const my_sel = router.query.sel
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    
    const dispatch = useDispatch()
    const [viewFilter, setViewFilter] = useState(false)
    const [zoom, setZoom] = useState(11)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()

    const [veiw_select, set_view_select] = useState(false)

    const [radius, setRadius] = useState(10)
    const [mapHeight, setMapHeight] = useState()
    // const ymaps = React.useRef(null);
    const [cluster_master, setClusterMaster] = useState(false)


    function ViewMaster(a, b) {
        if (window.innerWidth > 500) {
            setMapHeight(450)
            selectMaster(a)
            setZoom(b)
        } else {
            setMapHeight(window.innerWidth - 50)
            selectMaster(a)
            setZoom(b)
        }

    }


    const getZoom = () => {

        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const rightPoint = [center[0], bounds[1][1]]


            let radius = ymaps.current.coordSystem.geo.getDistance(
                [53.94843972554695, 27.603028939367363],
                [53.970144032848296, 27.696309659065204]
            )

          
            console.log(radius)
            setZoom(Map.current.getZoom())

        }
    }
  


  

    return (
        <>
           <Script src={'https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU'} /> 

            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message page="city" text='Masters.place позволяет познакомиться  с 
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
                {veiw_select ? null : <>
                    <span>Мастера в радиусе {radius} км</span>
                    <span onClick={() => setViewFilter(true)}>
                        радиус поиска
                    </span>
                </>}
                {viewFilter ? <div className={styles.all__filter}>
                    <h6 onClick={() => setViewFilter(false)} />
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

            <div className={styles.my_map} id="my_map" style={{ height: master ? "30vh" : mapHeight }}>
                <YMaps query={{ apikey: API_KEY }}>
                    <MapComponent 
                        setRadius={setRadius} 
                        set_view_select={set_view_select} 
                        master={master}  
                        zoom={zoom} 
                        masters={masters} 
                    />
                </YMaps>
            </div>

        </>
    )
}