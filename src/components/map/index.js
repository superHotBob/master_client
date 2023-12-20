import Image from 'next/image'
import arrow_down from '../../../public/arrow_down.svg'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { YMap, Map, Placemark, Clusterer, useYMaps } from '@pbe/react-yandex-maps'
import styles from '../../pages/masternear/city/near.module.css'



export default function MapComponent({ setRadius, setzoom, divHeight }) {
    const loc = useSelector((state => state.counter.location))
    const service = useSelector((state) => state.counter.service)
    const [center, setCenter] = useState()
    const [zoom, setZoom] = useState(13)
    const [mapHeight, setMapHeight] = useState()
    const [masters, setmasters] = useState([])

    const [address, setaddres] = useState()

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

    useEffect(() => {
        setMapHeight(divHeight)
        setZoom(10)
        setCenter(loc)
    }, [])

    function OnLoadMap() {
        const bounds = Map.current.getBounds()       
        const coord = bounds.flat().map(i => +i.toFixed(4))
        fetch(`/api/get_masters_coord?coord=${coord}&service=${service}`)
            .then(res => res.json())
            .then(res => setmasters(res))
        setTimeout(() => {
            document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
            document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-copyright__link')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-map-copyrights-promo')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-gototech')[0].style.display = 'none';
            document.getElementById('my_map').style.opacity = '1';
        }, 500)

        Map.current.events.add('actionend', function () {
            let bounds = Map.current.getBounds();
            let zoom = Map.current.getZoom();
            const coord = bounds.flat().map(i => +i.toFixed(4))
            const center = Map.current.getCenter()
            fetch(`/api/get_masters_coord?coord=${coord}&service=${service}`)
                .then(res => res.json())
                .then(res => {
                    setmasters(res)
                    setFilterMasters(res)
                })
            setZoom(zoom)
            let radius = ymaps.coordSystem.geo.getDistance(center, bounds[1]) / 1.2
            setRadius(Math.ceil(radius.toFixed(0) / 1000))
        });

    }


    async function SetFilterCluster() {
        setzoom(17)
        setTimeout(() => {
            const bounds = Map.current.getBounds()
            const coord = bounds.flat().map(i => +i.toFixed(4))
            setTimeout(() => {
                fetch(`/api/get_masters_coord?coord=${coord}&service=${service}`)
                    .then(res => res.json())
                    .then(res => setFilterMasters(res))
            }, 500)
        }, 500)
    }

    function ViewMaster(event, a) {
        event.stopPropagation()
        setCenter(a)
        setZoom(17)
        setzoom(17)
        setMapHeight(window.innerWidth > 500 ? '300px' : '300px')
        setTimeout(() => {
            const bounds = Map.current.getBounds()
            const coord = bounds.flat().map(i => +i.toFixed(4))
            fetch(`/api/get_masters_coord?coord=${coord}&service=${service}`)
                .then(res => res.json())
                .then(res => setFilterMasters(res))
        }, 500)
    }

    function closeView() {
        setViewMasters([])
        setFilterMasters([])
        setMapHeight(divHeight)
    }

    const getRadius = async (a) => {
        // const geo = await ymaps.geoQuery(ymaps.geocode('Минск')).getLength()

        // const  myGeocoder = ymaps.geocode('Минск');
        // console.log(myGeocoder)
        // // // var geocoder = await ymaps.geocode(await ymaps.GeoPoint(37.588395, 55.762718), {results: 1});

        // // console.log(geo)
        // myGeocoder.then(
        //     function (res) {
        //         console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
        //     },
        //     function (err) {
        //         alert('Ошибка');
        //     }
        // );
        // // if (view != 0) {
        // //     SetFilterCluster()
        // // }

        //     setzoom(Map.current.getZoom())
        //     if (Map.current) {

        //         // const center = Map.current.getCenter()
        //         // const zoom = Map.current.getZoom()           
        //         // setZoom(zoom)
        //         // const bounds = Map.current.getBounds()
        //         // const coord = bounds.flat().map(i => +i.toFixed(4))
        //         // fetch(`/api/get_masters_coord?coord=${coord}&service=${service}`)
        //         // .then(res => res.json())
        //         // .then(res => setmasters(res))  
        //         // let radius = ymaps.coordSystem.geo.getDistance(center, bounds[1]) / 1.2
        //         // console.log('radius', Math.ceil(radius.toFixed(0) / 1000))
        //         // setRadius(Math.ceil(radius.toFixed(0) / 1000))
        //     }
        //     SetFilterCluster()
    }
    function Bob() { setzoom(16) }

    async function getAddress(a) {
        const geocoder = ymaps.geocode(a.map(i => +i));
        geocoder.then(
            function (res) {
                const address = res.geoObjects.get(0).getAddressLine()
                setaddres(address)
            },
            function (err) {
                console.log('Ошибка');
            }
        )
    }
    const placeMark = (a, b, c) => {
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
                    this.getData().options.set('shape', bigShape);
                    this.getData().geoObject.events.add('click', function () { Bob(b) }, this);
                    this.getData().geoObject.events.add('mouseenter', function () { getAddress(c) }, this)
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
                    behaviors: ["default"]
                }}
                width="100%"
                height={mapHeight}
                instanceRef={yamap => {
                    if (yamap) {
                        Map.current = yamap;
                    }
                }}
                onLoad={OnLoadMap}
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
                        // setZoom(15)
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
                                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                properties={{
                                    hintContent: `<div style="border: none; color: blue; padding: 5px">
                                    <h3 style="font-weight: 600">Мастер:${i.name}</h3>
                                    <address>г.${address}</address>                                   
                                    </div>`,
                                    preset: "twirl#blueStretchyIcon",
                                    strokeColor: 'blue',
                                }}
                                options={{
                                    iconLayout: placeMark(ymaps.templateLayoutFactory, i.nikname, i.locations),
                                    iconOffset: [-20, -20]
                                }}
                                onClick={event => ViewMaster(event, i.locations)}
                            />
                        )}
                    </> : null}
                </Clusterer>
            </Map>
            {filter_masters.length ?
            <>
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
                        <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="master" />
                    </Link>
                )} 
            </>:null}
        </>
    );
};

