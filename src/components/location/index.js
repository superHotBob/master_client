import styles from './location.module.css'
import { useEffect, useRef, useState } from 'react'
import React from 'react'

import Image from 'next/image'
import { useYMaps, YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import icon_close from '../../../public/close.svg'

const API_KEY = "89caab37-749d-4e30-8fdf-e8045542f060"

function Mymap({ loc_master, nikname, place, address_total, city }) {   

    const [location, setLoc] = useState(loc_master)
    const [address , setaddress] = useState()
   
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
    function updateLocation(a,b) {
        fetch('/api/edit_location_master', {
            method: 'Post',
            body: JSON.stringify({
                nikname: nikname,
                locations: a,
                address: b,
                city: city,
                address_full: address_total
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(res=>localStorage.setItem("profile", JSON.stringify(res)))
    }  
    function getCoord(place) {
        if (!place) {
            return;
        }      
       
        function getAddress(a) {
        const geocoder = ymaps.geocode(a);
        geocoder.then(
            function (res) {
                const address = res.geoObjects.get(0).getAddressLine()               
                setaddress(address) 
                updateLocation(a,address)             
            },
            function (err) {
                console.log('Ошибка');
            }
        )
       
        }
        const myGeocoder = ymaps.geocode(place);    
        myGeocoder.then(
            function (res) {
                const my_loc = res.geoObjects.get(0).geometry.getCoordinates();
                setLoc(my_loc)
               
                getAddress(my_loc)                
            },
            function (err) {
                console.log('Ошибка');
            }

        );
    }  
    function Bob() {return;}  
    const placeMark = (a, b) => {
        if(ymaps){
            const Layout = a.createClass(`<img class="img" style=" border-radius: 50%; border: 3px solid #3D4EEA" height="44px" width="44px" src=${process.env.url_image + b + '.jpg'} />`, 
            {
               build: function () {
                   Layout.superclass.build.call(this);
                   const element = this.getParentElement().getElementsByClassName("img")[0];
                
                    const bigShape = {
                        type: 'Circle',
                        coordinates: [0,0],
                        radius: 50,
                    };
                    // Зададим фигуру активной области.
                    this.getData().options.set('shape',bigShape );                
                    this.getData().geoObject.events.add('click',function() {Bob(b)},this)
                
                }
            
            }
            
            );
            return Layout;
        }
    };

    return (
        <>
            <Map id="mymap"
                modules={["Clusterer", "Polygon", "GeoObject", "geoQuery", "control.ZoomControl", "control.FullscreenControl", "Placemark", "geocode",
                    "geoObject.addon.balloon", "borders", "ObjectManager", 'geoObject.addon.balloon', 'clusterer.addon.balloon',
                    "templateLayoutFactory"]}               
                state={{
                    center: loc_master,
                    zoom: 11,
                    controls: [],
                    behaviors: ["default", "scrollZoom", "multiTouch", "drag", "onclick"]
                }}
                width='100%'
                height="85vh"
                onLoad={(e) => {                  
                    ymaps.current = e
                }}
                instanceRef={ymaps => {
                    if (ymaps) {
                        Map.current = ymaps;
                    }
                }}
            >
                {ymaps ? <Placemark geometry={location}
                    modules={
                        ['geoObject.addon.balloon', 'geoObject.addon.hint', "templateLayoutFactory"]
                    }
                    options={{iconLayout: placeMark(ymaps.templateLayoutFactory, nikname),iconOffset: [-20, -20]}}
                    onLoad={() => ViewGrayScale()}
                /> : null}
            </Map>
            {address && <div>
                <p>Адрес: г. {address}</p>
                
            </div>}
        </>
    )
}


export default function Location({ loc_master, close, nikname, place, address_total, city }) {
    useEffect(()=>window.scrollTo(0,0),[])    
    return (
        <div className={styles.map}>
            <div className={styles.my_map} >
                <Image className={styles.close} src={icon_close} onClick={() => close(false)} alt="close" width={20} height={20} />
                <YMaps query={{ apikey: API_KEY }}>
                    <Mymap 
                        place={place} 
                        loc_master={loc_master}
                        nikname={nikname}
                        address_total={address_total}
                        city={city}
                    />
                </YMaps> 
                {/* <button onClick={() => close(false)} className={styles.confirm} >Сохранить</button>               */}
            </div>
        </div>
    )
}