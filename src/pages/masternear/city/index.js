import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import arrow_down from '../../../../public/arrow_down.svg'
import { useSelector, useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { YMaps, Map, Placemark, Clusterer, useYMaps, templateLayoutFactory } from '@pbe/react-yandex-maps'
import Script from 'next/script'

import Message from '@/components/message'

const url = 'https://masters-client.onrender.com/'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
 }
// const API_KEY = "05f8d2ae-bd94-4329-b9f9-7351e2ec9627"
const API_KEY ="89caab37-749d-4e30-8fdf-e8045542f060"
export default function MasterNear() {
    const router = useRouter()
    // const my_sel = router.query.sel
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service) 
    const loc = useSelector((state => state.counter.location))
    const dispatch = useDispatch()    
    const [viewFilter, setViewFilter] = useState(false)
    const [zoom, setZoom] = useState(11)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()
    const [filter_masters, setFilterMasters] = useState()
    const [mapHeight, setMapHeight] = useState()
    const ymaps = React.useRef(null);
    const [cluster_master, setClusterMaster] = useState(false)
   


    function ViewMaster(a, b) {
        if(window.innerWidth > 500) {
            setMapHeight(450)
        } else {
            setMapHeight(window.innerWidth - 50)
        }   
        selectMaster(a)
        setZoom(b)
    }
    useEffect(() => {  
        if(window.innerWidth > 500) {
            setMapHeight(450)
        } else {
            setMapHeight(window.innerWidth - 50)
        }   
        setMasters()       
        fetch('/api/all_masters_city?' + new URLSearchParams({
            city: my_city.toLowerCase(),
            service: service?service:pid 
        }), { next: { revalidate: 100 } })
        .then(res => res.json())
        .then(data => setMasters(data))
    }, [my_city])

    useEffect(() => {
        setFilterMasters(masters)
        if (masters) {
            let mast = masters.filter(i => i.services.includes(service) ? i : null)
            setFilterMasters(mast)
            console.log('Mast', mast)
        } else if (masters) {
            setFilterMasters(masters)
        } else {
        }
       
    }, [])


    const getZoom = () => {
       
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const rightPoint = [center[0], bounds[1][1]]
            console.log(bounds,rightPoint)
            console.log(Clusterer.current.getGeoObjects())
            
        //    let radius = ymaps.current.coordSystem.geo.getDistance(
        //         [53.94843972554695, 27.603028939367363],
        //         [53.970144032848296, 27.696309659065204]
        //     )
          
        //     // var suggestView1 = ymaps.current.SuggestView('suggest1');
        //     console.log(radius)
            setZoom(Map.current.getZoom())

        }
    }
    function SetFilterCluster(a) {
        
        
        setMapHeight(window.innerWidth > 500 ? '350px' : window.innerWidth/2 + 'px')
        // setZoom(12)
        setClusterMaster(true)
        // let filter_masters = masters.filter(i=>i.locations[0] > a[0][0] && i.locations[0] < a[1][0])
        console.log(filter_masters)
        // setMasters(filter_masters)
    }
    function CloseFilterCluster() {
        if(window.innerWidth > 500) {
            setMapHeight(500)
        } else {
            setMapHeight(window.innerWidth)
        }   
        setZoom(11)
        selectMaster()
        console.log(loc)
        // Map.current.coordSystem.geo.setCenter(my_city)
        setClusterMaster(false)
        Map.current.setCenter([53.94843972554695, 27.603028939367363])
    }
   

    function OnLoadMap() {
        setTimeout(()=>{
            document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
            document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'           
            document.getElementsByClassName('ymaps-2-1-79-copyright__link')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-map-copyrights-promo')[0].style.display = 'none';
            document.getElementsByClassName('ymaps-2-1-79-gototech')[0].style.display = 'none';
            document.getElementById('my_map').style.opacity = '1';
        },500)
        
      
    }
   
    return (
        <div className={styles.main}>
            <Script src={'https://api-maps.yandex.ru/3.0/?apikey=05f8d2ae-bd94-4329-b9f9-7351e2ec9627&lang=ru_RU'} />

            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message text={` Masters.place позволяет познакомиться  с 
                    мастерами вашего города. Для этого нужно выбрать 
                    ваш город, что бы увидеть список мастеров.
                `} />
            </div>
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>
            <div className={styles.selector}>
                <Link href={`/masternear/${service}`}>Список</Link>
                <Link href="/masternear/city" style={sel}>На карте</Link>
            </div>          
                <section>
                    <div className={styles.main__filter}>
                        {master ? null : <>
                            <span>Мастера в радиусе {Math.trunc(17 * (17 - zoom) / zoom)} км</span>
                            <span onClick={() => setViewFilter(true)}>
                                радиус поиска
                            </span>
                        </>}
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)} />
                            <p>{Math.trunc(17 * (17 - zoom) / zoom)} км</p>
                            <input className={styles.range} step="1" type="range" min="10" max="16" value={zoom} onChange={e => setZoom(e.target.value)} />

                        </div> : null}
                    </div>

                    <div className={styles.my_map} id="my_map" style={{height: master ? "30vh" : mapHeight,  width: '100vw', maxWidth: '500px' }}>
                        <YMaps instanceRef={ymaps}>
                            <Map id="mymap"
                                state={{
                                    center: master ? masters?.filter(i => i.nikname === master)[0].locations : loc,
                                    zoom: master ? 15 : zoom,
                                    behaviors: ["default", "scrollZoom","multiTouch","drag"]
                                }}
                                width="100%"
                                height={master ? "30vh" : mapHeight}
                                instanceRef={yaMap => {
                                    if (yaMap) {
                                        Map.current = yaMap;
                                    }
                                }}
                                onLoad={(e=>{
                                    ymaps.current = e
                                    console.log(e.coordSystem)
                                    OnLoadMap()
                                })}
                                onClick={() => getZoom()}
                                onWheel={() => {
                                    setZoom(Map.current.getZoom())
                                    console.log(Map.current.getZoom())
                                }}
                            
                            >
                                <Clusterer
                                    options={{
                                        preset: 'islands#invertedVioletClusterIcons',
                                        groupByCoordinates: false,                                       
                                        zoomMargin: [60,0,40,0] ,
                                        gridSize: 128,
                                        // clusterIconLayout: 'default#pieChart',
                                        // clusterIconContentLayout: '<div style="background: red; width: 50px; color: #FFFFFF; font-weight: bold;">100</div>',
                                        // clusterIconLayout: 10,
                                        clusterIcons: [{
                                            href: '/master.svg',
                                            size: [40, 40],                                           
                                            offset: [0, 0]                                            
                                        }] 
                                       
                                    }}
                                    onClick={()=>SetFilterCluster()}
                                    instanceRef={yaMap => {
                                        if (yaMap) {
                                            Clusterer.current = yaMap;
                                        }
                                    }}
                                >

                                    {masters?.map(i => <Placemark geometry={i.locations} key={i.nikname}
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
                                    onClick={() => ViewMaster(i.nikname, 14)}

                                    />)}
                                </Clusterer>
                            </Map>
                        </YMaps>
                    </div>
                </section>
          
            {master ? <section className={styles.section}>
                <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={() => ViewMaster('', 11)} />
                {masters?.filter(i => i.nikname === master).map(i =>
                    <Link key={i.nikname} className={styles.master} href={`/master/${i.nikname}`} >
                        <p style={{ width: '75%' }}>
                            <b>{i.name}</b> 
                            <span className={styles.pro}>MASTER</span>
                            {i.stars ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        <Image src={i.image ? url + 'var/data/' + i.nikname + '/main.jpg' : '/camera_wh.svg'} width={60} height={60} alt="image" />
                    </Link>)}
            </section> : null}
            {cluster_master ? <section className={styles.section}>
                <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={CloseFilterCluster} />
                {/* {cluster_masters?.map(i =>
                    <Link key={i.nikname} className={styles.master} href={`/master/${i.nikname}`} >
                        <p style={{ width: '75%' }}>
                            <b>{i.name}</b> 
                            <span className={styles.pro}>MASTER</span>
                            {i.stars ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        <Image src={i.image ? url + 'var/data/' + i.nikname + '/main.jpg' : '/camera_wh.svg'} width={60} height={60} alt="image" />
                    </Link>
                )} */}
            </section> : null}

        </div >
    )
}