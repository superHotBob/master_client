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

import useSWR, { useSWRConfig } from 'swr'
import Message from '@/components/message'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
}

const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"

const MapComponent = ({ setRadius, my_zoom , setzoom}) => {
    const loc = useSelector((state => state.counter.location))
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const [center, setCenter] = useState()
    const [zoom, setZoom] = useState(15)
    const [mapHeight, setMapHeight] = useState()
    const [master, selectMaster] = useState()
    const [view, setView] = useState(0)
    const [filter_masters, setFilterMasters] = useState([])
   
    const ymaps = useYMaps([
        "Map",
        "option.Manager",
        "option.presetStorage",
        "Placemark",
        "templateLayoutFactory",
        "coordSystem.geo",
        "Clusterer",
        "geoQuery"
    ])

    const { data: masters } = useSWR(`/api/all_masters_city?city=${my_city.toLowerCase()}&service=${service}`)


    // useEffect(() => {
    //     setMapHeight(window.innerHeight - 300)
    //     // if (window.innerWidth > 500) {
    //     //     setMapHeight(450)
    //     // } else {
    //     //     setMapHeight(window.innerWidth - 50)
    //     // }
    //     // setMasters()
    //     // fetch('/api/all_masters_city?' + new URLSearchParams({
    //     //     city: my_city.toLowerCase(),
    //     //     service: service ? service : pid
    //     // }), { next: { revalidate: 100 } })
    //     //     .then(res => res.json())
    //     //     .then(data => setMasters(data))
    // }, [my_city])

    useEffect(() => {
        setMapHeight(window.innerHeight - 300)
        setFilterMasters(masters)
        setZoom(10.8)
        setCenter(loc)
    }, [])
    // useEffect(() => setZoom(my_zoom), [my_zoom])



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
        console.log((my_zoom))
    }

    function filter_all_masters() {
        let coord = Map.current.getBounds()
        let new_masters = [...masters]
        .filter(i => { return coord[1][1] - i.locations[1] > 0 })
        .filter(i => { return coord[0][1] - i.locations[1] < 0 })
        .filter(i => { return coord[1][0] - i.locations[0] > 0 })
        .filter(i => { return coord[0][0] - i.locations[0] < 0 })
        setFilterMasters(new_masters)
        selectMaster(new_masters)
       
        const center = Map.current.getCenter()
        let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
        setRadius(Math.ceil(radius.toFixed(0) / 1000))
    }
    function SetFilterCluster(a) { 
        setView(2)
        if(a){                
            setTimeout(() => {
                let coord = Map.current.getBounds()
                const center = Map.current.getCenter()
                let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
                setRadius(Math.ceil(radius.toFixed(0) / 1000))       
                 
            }, 1000) 
            filter_all_masters()
            setzoom(17)            
        } else {
            setTimeout(() => filter_all_masters(), 500)  
                 
        }    
    }

    function closeView() {
        setView(0)
        setMapHeight(window.innerHeight - 300)
        selectMaster(null)
    }
    function ViewMaster(a) {
        setZoom(15)
        setCenter(masters?.filter(i => i.nikname === a)[0].locations)
        setMapHeight(window.innerWidth > 500 ? '300px' : '200px')
        setView(1)
        selectMaster(a)
        setTimeout(() => {
            let coord = Map.current.getBounds()
            const center = Map.current.getCenter()
            let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
            setRadius(Math.ceil(radius.toFixed(0) / 1000))
        }, 1000)
    }
    const getRadius = async () => {
        // const geo = await ymaps.geoQuery(ymaps.geocode('Минск')).getLength()
        // var myGeocoder = ymaps.geocode(" Минск Тикоцкого 9");

        // myGeocoder.then(

        //     function (res) {

        //         console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());

        //     },

        //     function (err) {

        //         alert('Ошибка');

        //     }

        // );
        // if (view != 0) {
        //     SetFilterCluster()
        // }
        setzoom(Map.current.getZoom())
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const zoom = Map.current.getZoom()
            setZoom(zoom)
            let radius = ymaps.coordSystem.geo.getDistance(center, bounds[1])
            setRadius(Math.ceil(radius.toFixed(0) / 1000))
        }
        SetFilterCluster()
    }
    function Bob() { setzoom(17) }

    const placeMark = (a, b) => {
        const Layout = a.createClass(my_zoom > 12 ? 
            `<img style=" border-radius: 50%; border: 3px solid #3D4EEA" height="44px" width="44px" src=${process.env.url_image + b + '.jpg'} />` :
            '<img src="/master.svg" height="40px" width="40px"/>',

            {
                build: function () {
                    Layout.superclass.build.call(this);
                    const bigShape = {
                        type: 'Circle',
                        coordinates: [20, 20],
                        radius: 22,
                    };
                    // Зададим фигуру активной области.
                    this.getData().options.set('shape', bigShape);
                    this.getData().geoObject.events.add('click', function () { Bob(b) }, this)

                }

            }

        );
        return Layout;
    };

    return (
        <>
            <Map id="mymap"
                modules={["Clusterer", "Polygon", "GeoObject", "geoQuery", "control.ZoomControl", "control.FullscreenControl", "Placemark", "geocode",
                    "geoObject.addon.balloon", "borders", "ObjectManager", 'geoObject.addon.balloon', 'clusterer.addon.balloon',
                    'templateLayoutFactory']}
                state={{                    
                    center: center,
                    zoom: zoom,
                    behaviors: ["default", "scrollZoom", "multiTouch", "drag"]
                }}
                width="100%"
                height={mapHeight}
                instanceRef={yamap => {
                    if (yamap) {
                        Map.current = yamap;
                    }
                }}
                onLoad={OnLoadMap}
                onWheel={getRadius}
                onTouchMove={SetFilterCluster}
                // onMouseUp={SetFilterCluster}
            >
                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false,
                        hasBallon: false,
                        isPropagationStopped: true,
                        hasHint: false,
                        zoomMargin: [40],                        
                        gridSize: 64,
                        clusterIcons: [{
                            href: '/master.svg',
                            size: [40, 40],
                            offset: [-20, -20],
                        }]
                    }}
                    onClick={(event) => {
                        SetFilterCluster() 
                        event.stopPropagation()                      
                        setZoom(15)
                        console.log('cluster', 16)
                        setMapHeight(window.innerWidth > 500 ? '400px' : '350px')
                    }}


                    instanceRef={ymaps => {
                        if (ymaps) {
                            Clusterer.current = ymaps;
                        }
                    }}

                >
                    {ymaps ? <>

                        {masters?.map(i =>
                            <Placemark geometry={i.locations} key={i.nikname}
                                modules={
                                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                }

                                properties={{
                                    hintContent: `<p style="border: none;color: blue;font-size: 17px;padding: 5px">${i.name}</p>`,
                                    preset: "twirl#blueStretchyIcon",
                                    strokeColor: 'blue',
                                }}
                                options={{
                                    iconLayout: placeMark(ymaps.templateLayoutFactory, i.nikname),

                                    // iconLayout: 'default#image',
                                    // iconImageHref: zoom >= 12 ? process.env.url_image + i.nikname + '.jpg' : '/master1.svg',
                                    // iconImageSize: [40, 40],
                                    iconOffset: [-20, -20]
                                }}
                                // onClick={(e) => {
                                //     e.stopPropagation()
                                //     ViewMaster(i.nikname)
                                // }}
                                onClick={(event) => {
                                    SetFilterCluster(i.locations)
                                    setCenter(i.locations)
                                    setZoom(17)
                                    event.stopPropagation()    
                                   
                                   
                                    setMapHeight(window.innerWidth > 500 ? '400px' : '350px')
                                }}
            
                            />)}
                    </> : null}
                </Clusterer>
            </Map>
            {view === 2 ? 
                <section className={styles.section}>
                    <Image alt="close" 
                        className={styles.close} 
                        src={arrow_down} 
                        width={25} height={25}
                        onClick={closeView}
                    />
                    {filter_masters?.map(i =>
                        <Link key={i.nikname} className={styles.master} href={`/${i.nikname}`}>
                            <div>
                                <p>
                                    <b>{i.name}</b>
                                    <span className={styles.pro}>MASTER</span>
                                    {i.stars != '0.0' ? <span className={styles.stars}>{i.stars}</span> : null}
                                </p>
                                <h4>{i.address}</h4>
                                <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                            </div>
                            <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="main_image" />
                        </Link>)}
                </section>
                : null
            }
                {/* : view == 1 ?
                    <section className={styles.section}>
                        <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25}
                            onClick={closeView}
                        />
                        {masters?.filter(i => i.nikname === master).map(i =>
                            <Link key={i.nikname} className={styles.master} href={`/${i.nikname}`}>
                                <div>
                                    <p>
                                        <b>{i.name}</b>
                                        <span className={styles.pro}>MASTER</span>
                                        {i.stars != '0.0' ? <span className={styles.stars}>{i.stars}</span> : null}
                                    </p>
                                    <h4>{i.address}</h4>
                                    <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                                </div>
                                <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="main_image" />
                            </Link>)}
                    </section>
                    : null} */}
        </>
    );
};




export default function MasterNear() {

    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)


    const [viewFilter, setViewFilter] = useState(false)
    const [zoom, setZoom] = useState(11)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()

    const [veiw_select, set_view_select] = useState(false)

    const [radius, setRadius] = useState(10)
    const [mapHeight, setMapHeight] = useState()

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
                {veiw_select ? null : <>
                    <span>Мастера в радиусе {radius} км</span>
                    <span onClick={() => setViewFilter(true)}>радиус поиска</span>
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
                        my_zoom={zoom}
                        masters={masters}
                        setzoom={setZoom}
                    />
                </YMaps>
                {/* <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25}
                    onClick={openView}
                />
                <div>

                </div> */}
            </div>

        </div>
    )
}