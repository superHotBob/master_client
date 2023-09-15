import styles from './location.module.css'
import { useEffect, useRef } from 'react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setlocation } from '@/reduser'
import Image from 'next/image'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import icon_close from '../../../public/close.svg'







export default function Location({ loc_master, close, nikname }) {
    const dispatch = useDispatch()

    function ViewGrayScale() {
        document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
        document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
        document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
    }
    function UpdateLocation(a) {      
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


    return (
        <div className={styles.map}>


            <div className={styles.my_map} >
                <Image src={icon_close} onClick={() => close(false)} alt="close" width={20} height={20} />
                
                <YMaps >
                    <Map id="mymap"
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

                        <Placemark geometry={loc_master}
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
                            onDragStart={(e) =>
                                console.log(e.get("target").geometry.getCoordinates())
                            }
                            onDragEnd={(e) => {
                                console.log(e.get("target").geometry.getCoordinates())
                                dispatch(setlocation(e.get("target").geometry.getCoordinates()))
                            }}
                            onClick={(e) => UpdateLocation(e.get("target").geometry.getCoordinates())}
                        />
                    </Map>
                </YMaps>
            </div>

        </div>
    )
}