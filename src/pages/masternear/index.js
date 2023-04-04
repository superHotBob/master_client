import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import arrow_down from '../../../public/arrow_down.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { YMaps, Map, Placemark, coordSystem , SearchControl} from '@pbe/react-yandex-maps'
import Script from 'next/script'
import FilterServices from '@/components/filterServices'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
}

export default function MasterNear() {
    const router = useRouter()
    const my_sel = router.query
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const dispatch = useDispatch()
    const [selector, setSelector] = useState(true)
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, setFilter] = useState(12)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()
    const [filter_masters, setFilterMasters] = useState()

    const defaultState = {
        center: [
            { name: 'минск', location: [53.904430, 27.554895] },
            { name: 'брест', location: [52.098208, 23.760049] }]
            .filter(i => i.name === my_city.toLowerCase())
            .map(i => i.location),
        zoom: filter,
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick","onWheel"]
    };
    function ViewMaster(a) {
        selectMaster(a)
    }
    useEffect(() => {
        setSelector(false)
        setMasters()
        async function GetMasters() {
            const response = await fetch('/api/all_masters_city?' + new URLSearchParams({
                city: my_city.toLowerCase()
            }))
            const result = await response.json()
            setMasters(result)
            let mast = result.filter(i => i.services.includes(service.toLowerCase()) ? i : null)
            setFilterMasters(mast)
        }

       GetMasters()

    }, [])
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
        if (!selector) {
            setTimeout(() => {
                document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)';
                document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none';
                document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none';
                document.getElementsByClassName('ymaps-2-1-79-gototech')[0].style.display = 'none';
                document.getElementById('my_map').style.opacity = '1';
            }, 1000)
        }

    }, [selector])

    const getZoom = () => {
        if (Map.current) {
            const bounds = Map.current.getBounds()
            const center = Map.current.getCenter()
            const rightPoint = [center[0], bounds[1][1]];
            // const radius = Map.current.getDistance(
            //     center,
            //     rightPoint
            //   );
            // console.log("currRadius", radius);
            
            setFilter(Map.current.getZoom());
            console.log(Map.current.getZoom())
        }
    }

    return (
        <div className={styles.main}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />
            <Header sel="/catalog" text="Мастера рядом " />
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>

            <div className={styles.selector}>
                <span onClick={() => setSelector(true)} style={selector ? sel : null}>Список</span>
                <span onClick={() => setSelector(false)} style={selector ? null : sel}>На карте</span>
            </div>

            {selector ?
                <section className={styles.section}>
                    <FilterServices />
                    {filter_masters?.map(i => <Link key={i.name} className={styles.master}
                        href={`/master/${i.nikname}`}
                    >
                        <p style={{ width: '75%' }} className={styles.name_stars}>
                            <span>{i.name}</span>
                            <span className={styles.pro}>MASTER</span>
                            {i.stars ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        <Image src={i.image} width={60} height={60} alt="image" />
                    </Link>)}
                </section>
                :
                <section>
                    <div className={styles.main__filter}>
                        <span>Мастера в радиусе {Math.ceil(16/filter) + 1} км</span>
                        <span onClick={() => setViewFilter(true)}>
                            радиус поиска
                        </span>
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)} />
                            <p>{Math.ceil(16/filter) + 1} км</p>
                            <input className={styles.range} step="1" type="range" min="10" max="16" value={filter} onChange={e => setFilter(e.target.value)} />

                        </div> : null}
                    </div>
                    <div className={styles.my_map} id="my_map">
                        <YMaps >

                            <Map id="mymap"
                                options={{
                                    set: defaultState,

                                }}
                                state={{
                                    center: master ? masters?.filter(i => i.nikname === master)[0].locations : defaultState.center[0],
                                    zoom:  filter ,
                                    controls: [],
                                    behaviors: ["default", "scrollZoom"]
                                }}
                                width="100%"
                                height={master ? "30vh" : "75vh"}
                                instanceRef={yaMap => {
                                    if (yaMap) {
                                        console.log(yaMap.coordSystem)
                                        Map.current = yaMap;
                                        console.log(Map.current._zoom)

                                    }
                                }}
                                onWheel={() => getZoom()}
                              

                            >

                                {masters?.map(i => <Placemark geometry={i.locations} key={i.id}
                                    modules={
                                        ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                    }
                                    properties={{
                                        hintContent: i.name,
                                        hintLayout: '<p>asdasdasd</p>',
                                        preset: "twirl#blueStretchyIcon",
                                        fillColor: 'red',
                                        strokeColor: 'blue'
                                    }}
                                    options={{
                                        iconLayout: 'default#image',
                                        iconImageHref: filter < 5 ? i.image : '/master1.svg',
                                        iconImageSize: [40, 40],
                                    }}

                                    onClick={() => ViewMaster(i.nikname)}

                                />)}
                            </Map>
                        </YMaps>
                    </div>
                </section>}
            {master && !selector ? <section className={styles.section}>
                <Image alt="close" className={styles.close} src={arrow_down} width={25} height={25} onClick={() => selectMaster()} />
                {masters?.filter(i => i.nikname === master).map(i => <Link key={i.nikname} className={styles.master}
                    href={`/master/${i.nikname}`}                  >
                    <p style={{ width: '75%' }}>
                        <b>{i.name}</b> {'  '}
                        <span className={styles.pro}>MASTER</span>
                        <span className={styles.stars}>{i.stars}</span>
                    </p>
                    <h4>{i.address}</h4>
                    <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                    <Image src={i.image} width={60} height={60} alt="image" />
                </Link>)}
            </section> : null}

        </div >
    )
}