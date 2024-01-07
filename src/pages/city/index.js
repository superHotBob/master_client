import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch , useSelector} from 'react-redux'
import { setcity, setstate, setlocation } from '../../reduser.js'
import useSWR from 'swr'


export default function City() {
    const [selCity, setSelCity] = useState({})
    const [findcity, setfindcity] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()
    const mystate = useSelector(state=>state.counter.mystate)

    const { data } = useSWR(`/api/get_cities?city=${findcity}&mystate=${mystate}`)


    async function setMyCity(a,b) {
        setSelCity({...selCity,city: a, state: b})
        setfindcity(a)
        const res = await fetch(`/api/get_citi_coord?city=${a}`)
        const { lat, lon } = await res.json()
        dispatch(setcity(a)) 
        dispatch(setstate(b))           
        dispatch(setlocation([lat, lon]))
        // router.back()
    }
  

    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                 Выбор города
                <button onClick={setMyCity}>Принять</button>
            </header>
            <input
                className={styles.seachcity}
                type="search"
                value={findcity}
                placeholder='Ваш город'
                onChange={(e) => setfindcity(e.target.value)}
            />
           
                {data
                    ?.map(i =>
                        <label className={styles.city} key={i.city}>
                            <div>
                                <b>{i.city}</b>
                                <span>{i.country}</span>
                            </div>

                            <span className={i.city === selCity.city ? styles.enabled : styles.disabled}></span>
                            <input
                                type="radio"
                                checked={i.city === selCity.city}
                                value={selCity.city}
                                name="city"
                                onChange={() => setMyCity(i.city,i.state)}
                            />
                        </label>
                    )
                }
           
        </>
    )

}