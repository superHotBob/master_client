import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity, setlocation } from '../../reduser.js'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function City() {
    const [myCitys, setMyCitys] = useState()
    const [selCity, setSelCity] = useState()
    const [findcity, setfindcity] = useState()
    const my_city = useSelector(state => state.counter.city)
    const router = useRouter()
    const ref = useRef()
    const addref = useRef()
    const dispatch = useDispatch()
    const { data, isLoading } = useSWR('/api/get_cities', fetcher)

   


    function setMyCity() {
        setfindcity(selCity)
        let new_data = [...data]
        let loc = new_data.filter(i => i.city === selCity)
        console.log([+loc[0].lat, +loc[0].lon])
        dispatch(setcity(selCity))
        dispatch(setlocation([+loc[0].lat, +loc[0].lon]))
    }
    useEffect(()=>{
        data?.filter(i=>i.city.includes(findcity))

    },[findcity])
    // function selectCity(e) {
    //     if (e.target.value) {
    //         let cc = myCitys.filter(i => i.toLowerCase().includes(e.target.value) ? i : null)
    //         setMyCitys(cc)
    //     } else {
    //         setMyCitys(citys)
    //     }
    // }
    // const AddCity = async () => {
    //     let new_city = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${addref.current.value}&country=BY`,
    //         {
    //             headers: { 'X-Api-Key': 'xxDz7cf1MDoWKvKJ7p9uLA==msmQGP675Gxdy2i4' },
    //             contentType: 'application/json'
    //         })
    //         .then(res => res.json())
    //     console.log(new_city)
    //     let data = { city: addref.current.value, lon: new_city[0].longitude, lat: new_city[0].latitude }
    //     fetch('/api/add_city', {
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         method: 'POST',
    //     })
    //     .then(res => res.json())
    //     .then(res => router.reload())

    // }

    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>Выбор города</h4>
                <h4 onClick={setMyCity}>Принять</h4>
            </header>
            <input
                className={styles.seachcity}
                type="search"
                value={findcity}
                placeholder='Ваш город'
                onChange={(e) => setfindcity(e.target.value)}
            />
            <section className={styles.section}>
               
                    {data?.filter(i=> findcity ? i.city.toLowerCase().includes(findcity.toLowerCase()): i).sort((a, b) => { return a.city.toLowerCase() < b.city.toLowerCase() ? -1 : 1 }).map(i =>
                        <label className={styles.city} key={i.city}>
                            <span>{i.city}</span>
                            <span className={i.city === selCity ? styles.enabled : styles.disabled}></span>
                            <input type="radio" checked={i.city === selCity} value={selCity} name="city" onChange={() => setSelCity(i.city)} />
                        </label>
                    )}
                    {isLoading ? <h5>Загружаем города...</h5> : null}
               
                {/* <div>
                    Нет в списке.<br/>
                    <label>Добавить город
                    <input placeholder='Введите ваш город' className={styles.addcity } ref={addref} type="text" />
                    </label>
                    <button onClick={AddCity} className={styles.seachcity}>Добавить</button>
                </div> */}
            </section>
        </div>
    )
}