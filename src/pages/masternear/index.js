import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import arrow_down from '../../../public/arrow_down.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { YMaps, Map, Placemark, useYMaps } from '@pbe/react-yandex-maps'
import Script from 'next/script'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
}

export default function MasterNear() {
    const router = useRouter()
    const my_sel = router.query.sel
   
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const loc = useSelector((state=>state.counter.location))
    const dispatch = useDispatch()
    const [selector, setSelector] = useState('true')
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, setFilter] = useState(11.4)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()
    const [filter_masters, setFilterMasters] = useState()
    console.log(loc)

    // const defaultState = {
    //     center: [
    //         { name: 'минск', location: [53.904478111637374, 27.556582167586544 ]},
    //         { name: 'брест', location: [52.098208, 23.760049] }]
    //         .filter(i => i.name === my_city.toLowerCase())
    //         .map(i => i.location),
    //     zoom: filter,
    //     controls: [],
    //     behaviors: ["default", "scrollZoom", "onclick", "onWheel"]
    // };
    function ViewMaster(a, b) {
        selectMaster(a)
        setFilter(b)
    }
    useEffect(() => {
        setSelector(my_sel)        
        setMasters()
        async function GetMasters() {
            const response = await fetch('/api/all_masters_city?' + new URLSearchParams({
                city: my_city.toLowerCase(),
                service: my_sel ? service.toLowerCase() : null
            }))
            const result = await response.json()
            setMasters(result)
            let mast = result.filter(i => i.services.includes(service.toLowerCase()) ? i : null)
            setFilterMasters(mast)
        }
        GetMasters()
    }, [service])

    useEffect(() => {
        setFilterMasters(masters)
       
        if (masters) {
            let mast = masters.filter(i => i.services.includes(service.toLowerCase()) ? i : null)
            setFilterMasters(mast)
            console.log('Mast', mast)
        } else if (masters) {
            setFilterMasters(masters)
        } else {
        }
    }, [selector])
   

    const getZoom = () => {
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const rightPoint = [center[0], bounds[1][1]]
            // const radius = ymaps.coordSystem.geo.getDistance(
            //     [53.94843972554695, 27.603028939367363],
            //     [53.970144032848296, 27.696309659065204]
            // )
            // console.log("currRadius", radius)
            // var suggestView1 = Map.current.SuggestView('suggest1');
            // console.log(suggestView1)
            setFilter(Map.current.getZoom())

        }
    }

    function OnLoadMap() {
        document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(100%)';
        document.getElementsByClassName('ymaps-2-1-79-copyright__link')[0].style.display = 'none';
        document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none';
        document.getElementsByClassName('ymaps-2-1-79-gototech')[0].style.display = 'none';
        document.getElementById('my_map').style.opacity = '1';
    }
    function SetSelector() {
        setSelector('true')
        selectMaster()
        setFilter(11)
    }
    return (
        <div className={styles.main}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />

            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
            <Message text={` Masters.place позволяет познакомиться  с 
                    мастерами вашего города. Для этого нужно выбрать 
                    ваш город, что бы увидеть список мастеров.
                `} /> 
            </div>
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>
            <div className={styles.selector}>
                <span onClick={() => SetSelector('true')} style={selector === 'true' ? sel : null}>Список</span>
                <span onClick={() => setSelector('false')} style={selector === 'true' ? null : sel}>На карте</span>
            </div>
            {selector === 'true' ?
                <section className={styles.section}>
                    <FilterServices />
                    {filter_masters?.map(i =>
                        <Link key={i.name} className={styles.master}
                            href={`/master/${i.nikname}`}
                        >
                            <p className={styles.name_stars}>
                                <span>{i.name}</span>
                                <span className={styles.pro}>MASTER</span>
                                {i.stars ? <span className={styles.stars}>{i.stars}</span> : null}
                            </p>
                            <h4>{i.address}</h4>
                            <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                            <Image src={i.image ? i.image : '/camera_wh.svg'} width={60} height={60} alt="image" />
                        </Link>)}
                </section>
                :
                <section>
                    <div className={styles.main__filter}>
                        {master ? null : <>
                            <span>Мастера в радиусе {Math.trunc(16 * (18 - filter) / filter)} км</span>
                            <span onClick={() => setViewFilter(true)}>
                                радиус поиска
                            </span>
                        </>}
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)} />
                            <p>{Math.trunc(16 * (18 - filter) / filter)} км</p>
                            <input className={styles.range} step="1" type="range" min="10" max="16" value={filter} onChange={e => setFilter(e.target.value)} />

                        </div> : null}
                    </div>
                   
                    <div className={styles.my_map} id="my_map">
                        <YMaps>

                            <Map id="mymap"
                                // modules={["coordSystem.geo","SuddestView"]}
                                // options={{  center : [52.098208, 23.760049]}}
                                state={{
                                    center: master ? masters?.filter(i => i.nikname === master)[0].locations : loc   ,
                                    zoom: master ? 14 : filter,
                                    behaviors: ["default", "scrollZoom"]
                                }}
                                width="100%"
                                height={master ? "30vh" : "75vh"}
                                instanceRef={yaMap => {
                                    if (yaMap) {
                                        Map.current = yaMap;
                                    }
                                }}
                                onLoad={OnLoadMap}
                                onClick={() => getZoom()}
                                onWheel={() => setFilter(Map.current.getZoom())}
                            >

                                {masters?.map(i => <Placemark geometry={i.locations} key={i.id}
                                    modules={
                                        ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                    }
                                    properties={{
                                        hintContent: i.name,
                                        preset: "twirl#blueStretchyIcon",
                                        strokeColor: 'blue'
                                    }}
                                    options={{
                                        iconLayout: 'default#image',
                                        iconShape: {type: 'Circle', coordinates: [0, 0], radius: 14},
                                        iconImageHref: filter > 12 ? i.image : '/master1.svg',
                                        iconImageSize: [40, 40],
                                        style: {border: '2px solid red'}
                                    }}

                                    onClick={() => ViewMaster(i.nikname, 14)}

                                />)}
                            </Map>
                        </YMaps>
                    </div>
                </section>}
            {master ? <section className={styles.section}>
                <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={() => ViewMaster('', 11)} />
                {masters?.filter(i => i.nikname === master).map(i => 
                <Link key={i.nikname} className={styles.master} href={`/master/${i.nikname}`} >                                     
                    <p style={{ width: '75%' }}>
                        <b>{i.name}</b> {'  '}
                        <span className={styles.pro}>MASTER</span>
                        <span className={styles.stars}>{i.stars}</span>
                    </p>
                    <h4>{i.address}</h4>
                    <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                    <Image src={i.image ? i.image : '/camera_wh.svg'} width={60} height={60} alt="image" />
                </Link>)}
            </section> : null}

        </div >
    )
}