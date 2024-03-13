import Image from 'next/image'
import styles from '../city/city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setstate, setlocation } from '../../reduser.js'
import useSWR from 'swr'


export default function States() {
    const [place, setplace] = useState({})
    const [findcity, setfindcity] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()

   const { data } = useSWR(`/api/get_states?state=${findcity.toLowerCase()}`)


    function setMyCity(a, b, c) {
        setplace({ ...place, state: a, lat: b, lon: c })
        dispatch(setstate(a))
        dispatch(setlocation([b, c]))
        router.back()
    }
    return (
        <>
            <header className={styles.header}>
               <Image src={arrow} alt="back" onClick={() => router.back()} />
                Выбор области
            </header>
            <input
                className={styles.seachcity}
                type="search"
                value={findcity}
                autoFocus
                placeholder='Введите область'
                onChange={(e) => setfindcity(e.target.value)}
            />
            {data
                ?.map(i =>
                    <label className={styles.city} key={i.state}>
                        <div>
                            <b>{i.state}</b>
                            <span>{i.country}</span>
                        </div>

                        <span className={i.state === place.state ? styles.enabled : styles.disabled}/>
                        <input
                            type="radio"
                            checked={i.state === place.state}
                            value={place.state}
                            name="city"
                            onChange={() => setMyCity(i.state, i.lat, i.lon)}
                        />
                    </label>
                )
            }

        </>
    )
}