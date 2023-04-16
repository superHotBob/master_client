import styles from './location.module.css'
import Script from 'next/script'
import Image from 'next/image'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import icon_close from '../../../public/close.svg'

export default function Location({locations,close}) {

    function ViewGrayScale() {          
        document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
        document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
        document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
    }
    
    const defaultState = {        
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"]
    };
    return (
        <div className={styles.map}>
            <Script src="https://api-maps.yandex.ru/3.0/?apikey=89caab37-749d-4e30-8fdf-e8045542f060&lang=ru_RU" />
            <div className={styles.my_map} >
                <Image src={icon_close} onClick={()=>close(false)} alt="close" width={20} height={20}/>
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
                                   
                                    options={{
                                        iconLayout: 'default#image',
                                        iconImageHref: '/master1.svg',
                                        iconImageSize: [40, 40],
                                    }}
                                    onLoad={()=>ViewGrayScale()}  
                                    
                                />
                            </Map>
                        </YMaps>
                    </div>

        </div>
    )
}