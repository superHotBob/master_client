import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import styles from './near.module.css'
import arrow_down from '../../../public/arrow_down.svg'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import Script from 'next/script'
import FilterServices from '@/components/filterServices'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 600
}

export default function MasterNear() {
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)
    const dispatch = useDispatch()
    const [selector, setSelector] = useState(1)
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, setFilter] = useState(10)
    const [master, selectMaster] = useState()
    const [masters, setMasters] = useState()
    const [filter_masters, setFilterMasters] = useState()

    const defaultState = {
        center: [
            { name: 'минск', location: [53.904430, 27.554895] },
            { name: 'брест', location: [52.098208, 23.760049] }]
            .filter(i => i.name === my_city.toLowerCase())
            .map(i => i.location),
        zoom: filter * 1.2,
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"]
    };
    function ViewMaster(a) {
        selectMaster(a)
    }
    useEffect(() => {
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
            console.log('Mast',mast)
        } else if (masters) {
            setFilterMasters(masters)
        } else {

        }

    }, [service])

    function Clic() {        
        document.getElementsByTagName('svg')[0].style.opacity = 0
    }

    return (
        <div className={styles.main}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />
            <Header sel="/catalog" text="Мастера рядом " />
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>

            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Список</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>На карте</span>
            </div>

            {selector ?
                <section className={styles.section}>
                    <FilterServices />
                    {filter_masters?.map(i => <Link key={i.name} className={styles.master}
                        style={{ backgroundImage: "url(" + i.image + ")" }}
                        href={`/master/${i.nikname}`}
                    >
                        <p style={{ width: '75%' }} className={styles.name_stars}>
                            <span>{i.name}</span>
                            <span className={styles.pro}>MASTER</span>
                            {i.stars ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                    </Link>)}
                </section>
                :
                <section>
                    {masters ? <div className={styles.main__filter}>
                        <span>Мастера в радиусе {filter} км</span>
                        <span onClick={() => setViewFilter(true)}>
                            радиус поиска
                        </span>
                        {viewFilter ? <div className={styles.all__filter}>
                            <h6 onClick={() => setViewFilter(false)} />
                            {/* <div className={styles.all__filter__data}>
                                {[1, 3, 5, 10].map(i =>
                                    <b onClick={() => setFilter(i)} key={i} id={i} >{i}км</b>)}
                            </div> */}

                            <p>{filter} км</p>
                            <input className={styles.range} step="1" type="range" min="1" max="10" value={filter} onChange={e => setFilter(e.target.value)} ></input>

                        </div> : null}
                    </div> : null}
                    <div className={styles.my_map} >
                        <YMaps >
                            <Map id="mymap"
                                options={{ set: defaultState }}
                                state={{
                                    center: master ? masters.filter(i => i.nikname === master)[0].locations : defaultState.center[0],
                                    zoom: master ? 14 : 10 + 10 / filter * 0.8,
                                    controls: [],
                                    behaviors: ["default", "scrollZoom"]
                                }} width="100%" height={master ? "30vh" : "75vh"}  >
                                {masters.map(i => <Placemark geometry={i.locations} key={i.id}
                                    properties={{
                                        hintContent: i.name,
                                        // iconColor: 'green',
                                        // preset: "twirl#blueStretchyIcon",
                                        // fillColor: 'ff0000',
                                        // strokeColor: 'ff0000'
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
                {masters.filter(i => i.nikname === master).map(i => <Link key={i.nikname} className={styles.master}
                    style={{ backgroundImage: "url(" + i.image + ")" }} href={`/master/${i.nikname}`}                  >
                    <p style={{ width: '75%' }}>
                        <b>{i.name}</b> {'  '}
                        <span className={styles.pro}>MASTER</span>
                        <span className={styles.stars}>{i.stars}</span>
                    </p>
                    <h4>{i.address}</h4>
                    <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                </Link>)}
            </section> : null}

        </div >
    )
}