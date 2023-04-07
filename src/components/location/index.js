import styles from './location.module.css'
import Script from 'next/script'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import { useEffect } from 'react';

export default function Location({locations,close}) {

    useEffect(()=>{
        setTimeout(() => {                
            document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
            document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
            document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
        }, 2000)

    },[])

    const defaultState = {        
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"]
    };
    return (
        <div className={styles.map}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />
            <div className={styles.my_map} >
                <span onClick={()=>close(false)}>close</span>
                        <YMaps >
                            <Map id="mymap"
                                options={{ set: defaultState }}
                                state={{
                                    center: locations ,
                                    zoom:  14 ,
                                    controls: [],
                                    behaviors: ["default", "scrollZoom"]
                                }} width='100%' height= "75vh"                                
                               
                            >
                                <Placemark geometry={locations} 
                                 modules= {
                                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                }
                                    properties={{
                                        hintContent: 'i.name',
                                        hintLayout: '<p>asdasdasd</p>',
                                        preset: "twirl#blueStretchyIcon",
                                        fillColor: 'red',
                                        strokeColor: 'blue'
                                    }}
                                    options={{
                                        iconLayout: 'default#image',
                                        iconImageHref: '/master1.svg',
                                        iconImageSize: [40, 40],
                                    }}

                                    
                                />
                            </Map>
                        </YMaps>
                    </div>

        </div>
    )
}