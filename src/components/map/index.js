import Image from 'next/image'
import arrow_down from '../../../public/arrow_down.svg'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Map, Placemark, Clusterer, useYMaps } from '@pbe/react-yandex-maps'
import styles from '../../pages/masternear/city/near.module.css'
import useSWR from 'swr'


export default function MapComponent({ setRadius, my_zoom, setzoom, divHeight }) {
    const loc = useSelector((state => state.counter.location))
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const [center, setCenter] = useState()
    const [zoom, setZoom] = useState(15)
    const [mapHeight, setMapHeight] = useState()
    // const [master, selectMaster] = useState()
    const [viewMasters, setViewMasters] = useState(0)
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
        console.log(divHeight)
        setMapHeight(divHeight-20)
        // setFilterMasters([])
        setZoom(10.8)
        setCenter(loc)
    }, [])
    useEffect(() => setZoom(my_zoom), [my_zoom])



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
        // selectMaster(new_masters)
        console.log(new_masters)
        const center = Map.current.getCenter()
        let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
        setRadius(Math.ceil(radius.toFixed(0) / 1000))
    }
    function SetFilterCluster(a) {
        // setView(2)
        if (a) {
            setTimeout(() => {
                let coord = Map.current.getBounds()
                const center = Map.current.getCenter()
                let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
                setRadius(Math.ceil(radius.toFixed(0) / 1000))

            }, 1000)
            // filter_all_masters()
            setzoom(17)
        } else {
            setTimeout(() => filter_all_masters(), 500)

        }
    }

    function ViewMaster(event, a) {

        event.stopPropagation()
        setCenter(a)
        setZoom(17)
        setzoom(17)
        // getRadius(17)
        SetFilterCluster()
        console.log('placemark')
        // SetFilterCluster(i.locations)                                 
        setMapHeight(window.innerWidth > 500 ? '300px' : '300px')
    }

    function closeView() {
        if(filter_masters.length>0) {        
        setViewMasters([])
        setFilterMasters([])
        setMapHeight(divHeight)
        } else {
            SetFilterCluster()
            setMapHeight(window.innerWidth > 500 ? 350 : 350)
        }
        // selectMaster(null)
    }
    // function ViewMaster(a) {
    //     setZoom(15)
    //     setCenter(masters?.filter(i => i.nikname === a)[0].locations)
    //     setMapHeight(window.innerWidth > 500 ? '300px' : '200px')
    //     setView(1)
    //     selectMaster(a)
    //     setTimeout(() => {
    //         let coord = Map.current.getBounds()
    //         const center = Map.current.getCenter()
    //         let radius = ymaps.coordSystem.geo.getDistance(center, coord[1])
    //         setRadius(Math.ceil(radius.toFixed(0) / 1000))
    //     }, 1000)
    // }
    const getRadius = async (a) => {
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
        console.log(a)
        setzoom(Map.current.getZoom())
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const zoom = Map.current.getZoom()
            setZoom(zoom)
            console.log(zoom)
            let radius = ymaps.coordSystem.geo.getDistance(center, bounds[1])
            setRadius(Math.ceil(radius.toFixed(0) / 1000))
        }
        SetFilterCluster()
    }
    function Bob() { setzoom(17) }

    const placeMark = (a, b) => {
        const Layout = a.createClass(zoom > 12 ?
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
                onWheel={() => getRadius()}
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
                        gridSize: 128,
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
                        console.log('cluster')
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
                                    hintContent: `<p style="border: none;color: blue;font-size: 17px;padding: 5px">
                                    ${i.name}<br/>
                                    ${i.address}
                                    </p>`,
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
                                onClick={event => ViewMaster(event, i.locations)}

                            />)}
                    </> : null}
                </Clusterer>
            </Map>


            <Image alt="close"
                className={filter_masters.length != 0 ?  styles.close : styles.open}
                src={arrow_down}
                width={25} height={25}
                onClick={closeView}
            />
            {filter_masters.length > 0 ? <>
            <section className={styles.section}>
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
                        <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="master" />
                    </Link>
                )}
               
            </section>
            </>: null}

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

