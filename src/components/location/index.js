import styles from './location.module.css'
import { useEffect, useRef } from 'react'
import Script from 'next/script'
import Image from 'next/image'
import { YMaps, Map, Placemark, withYMaps, useYMaps } from '@pbe/react-yandex-maps'
import icon_close from '../../../public/close.svg'
// function MapSuggestComponent(props) {
//     const ymaps = useYMaps(["Map"]);
  
//     console.log(ymaps);
  
//     React.useEffect(() => {
//       const suggestView = new ymaps.SuggestView("suggest");
//     }, [ymaps.SuggestView]);
  
//     return <input type="text" id="suggest" />;
//   }

//   const CustomMap = () => {
//     const mapRef = useRef(null);
//     const ymaps = useYMaps(["Map"]);
  
//     useEffect(() => {
//       if (!ymaps || !mapRef.current) {
//         return;
//       }
  
//       new ymaps.Map(mapRef.current, {
//         center: [55.76, 37.64],
//         zoom: 10
//       });
//     }, [ymaps]);
  
//     return <div ref={mapRef} style={{ width: "320px", height: "240px" }} />;
//   };
  const SuggestComponent = () => {
    return withYMaps(MapSuggestComponent, true, [
      "SuggestView",
      "geocode",
      "coordSystem.geo"
    ]);
  };

const API_KEY = "05f8d2ae-bd94-4329-b9f9-7351e2ec9627"  
//const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"
export default function Location({loc_master, close, nikname}) {

    function ViewGrayScale() {          
        document.getElementsByClassName('ymaps-2-1-79-ground-pane')[0].style.filter = 'grayscale(1)'
        document.getElementsByClassName('ymaps-2-1-79-copyright')[0].style.display = 'none'
        document.getElementsByClassName('ymaps-2-1-79-gotoymaps')[0].style.display = 'none'
    }
    function UpdateLocation(a) {
        fetch('/api/edit_location_master',{
            method: 'Post',
            body: JSON.stringify({
                nikname: nikname,
                locations: a 
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res=>res.json())
    }
    
    const defaultState = {        
        controls: [],
        behaviors: ["default", "scrollZoom", "onclick"],
        
    };
   
      console.log(SuggestComponent);  
    return (
        <div className={styles.map}>
           
            <Script src={`https://api-maps.yandex.ru/3.0/?apikey=${API_KEY}&lang=ru_RU`} />
            <div className={styles.my_map} >
                <Image src={icon_close} onClick={()=>close(false)} alt="close" width={20} height={20}/>
                        <YMaps >
                       
                        {/* <SuggestComponent /> */}
                            <Map id="mymap"
                                options={{ set: defaultState }}
                                state={{
                                    center: loc_master ,
                                    zoom:  12 ,
                                    controls: [],
                                    behaviors: ["default", "scrollZoom","multiTouch","drag","onclick"]
                                }} width='100%' height= "75vh"
                                                              
                               
                            >
                               
                                <Placemark geometry={loc_master} 
                                 modules= {
                                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                }
                                   
                                    options={{
                                        draggable: true,
                                        iconLayout: 'default#image',
                                        iconImageHref: '/master1.svg',
                                        iconImageSize: [40, 40],
                                        preset: "islands#yellowDotIcon",
                                    }}
                                    onLoad={()=>ViewGrayScale()}
                                    onDragStart={(e) =>
                                        console.log(e.get("target").geometry.getCoordinates())
                                      }
                                    onDragEnd={(e) =>
                                        console.log(e.get("target").geometry.getCoordinates())
                                      }  
                                    onClick={(e) => UpdateLocation(e.get("target").geometry.getCoordinates())}
                                />
                            </Map>
                        </YMaps>
                    </div>

        </div>
    )
}