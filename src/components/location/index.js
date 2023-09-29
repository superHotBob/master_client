import styles from './location.module.css'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setlocation } from '@/reduser'
import Image from 'next/image'
import { useYMaps, YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import icon_close from '../../../public/close.svg'



const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"



function Mymap({ loc_master, nikname, place }) {
    const dispatch = useDispatch()

    const [loc, setLoc] = useState(loc_master)


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

    function ViewGrayScale() {
        document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
        document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
        document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
        getCoord(place)
    }
    function updateLocation(a) {
        fetch('/api/edit_location_master', {
            method: 'Post',
            body: JSON.stringify({
                nikname: nikname,
                locations: a
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
    }

    const defaultState = {
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"],

    };
    function getCoord(place){

        console.log(place)
        const  myGeocoder = ymaps.geocode(place);

        myGeocoder.then(

            function (res) {

                const my_loc = res.geoObjects.get(0).geometry.getCoordinates();
                setLoc(my_loc)
                updateLocation(my_loc)
            },

            function (err) {

                console.log('Ошибка');

            }

        );
    }


    return (
        <>
            <Map id="mymap"
                modules={["Clusterer", "Polygon", "GeoObject", "geoQuery", "control.ZoomControl", "control.FullscreenControl", "Placemark", "geocode",
                    "geoObject.addon.balloon", "borders", "ObjectManager", 'geoObject.addon.balloon', 'clusterer.addon.balloon',
                    'templateLayoutFactory']}
                options={{ set: defaultState }}
                state={{
                    center: loc_master,
                    zoom: 12,
                    controls: [],
                    behaviors: ["default", "scrollZoom", "multiTouch", "drag", "onclick"]
                }}
                width='100%'
                height="75vh"

            >

                <Placemark geometry={loc}
                    modules={
                        ['geoObject.addon.balloon', 'geoObject.addon.hint']
                    }

                    options={{
                        draggable: true,
                        iconLayout: 'default#image',
                        iconImageHref: '/master.svg',
                        iconImageSize: [40, 40],
                        preset: "islands#yellowDotIcon",
                    }}
                    onLoad={() => ViewGrayScale()}
                    // onDragStart={(e) =>
                    //     console.log(e.get("target").geometry.getCoordinates())
                    // }
                    // onDragEnd={(e) => {
                    //     console.log(e.get("target").geometry.getCoordinates())
                    //     dispatch(setlocation(e.get("target").geometry.getCoordinates()))
                    // }}
                    // onClick={(e) => UpdateLocation(e.get("target").geometry.getCoordinates())}
                />
            </Map>


        </>
    )
}


export default function Location({ loc_master, close, nikname, place }) {
   
    return (
        <div className={styles.map}>


            <div className={styles.my_map} >
                <Image src={icon_close} onClick={() => close(false)} alt="close" width={20} height={20} />
                <YMaps query={{ apikey: API_KEY }}>
                    <Mymap place={place} loc_master={loc_master} nikname={nikname}/>
                </YMaps>
            </div>
        </div>
    )
}