import Image from 'next/image'
import styles from '../city/city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import {  setstate, setlocation } from '../../reduser.js'
import useSWR from 'swr'


export default function City() {
    const [place, setplace] = useState({})
    const [findcity, setfindcity] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()

    const { data } = useSWR(`/api/get_states?state=${findcity}`)


    async function setMyCity() {       
        dispatch(setstate(place.state))           
        dispatch(setlocation([place.lat, place.lon]))       
        router.back()
    }
    // useEffect(() => {
    //     data?.filter(i => i.state.includes(findcity))
    // }, [findcity])




    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                   Выбор области
                <button onClick={setMyCity}>Принять</button>
            </header>
            <input
                className={styles.seachcity}
                type="search"
                value={findcity}
                placeholder='Ваша область'
                onChange={(e) => setfindcity(e.target.value)}
            />
            <section className={styles.section}>
                {data
                    ?.map(i =>
                        <label className={styles.city} key={i.state}>
                            <div>
                                <b>{i.state}</b>
                                <span>{i.country}</span>
                            </div>

                            <span className={i.state === place.state ? styles.enabled : styles.disabled}></span>
                            <input
                                type="radio"
                                checked={i.state === place.state}
                                value={place.state}
                                name="city"
                                onChange={() => setplace({...place,state:i.state, lat: i.lat,lon: i.lon})}
                            />
                        </label>
                    )
                }
            </section>
        </>
    )
}