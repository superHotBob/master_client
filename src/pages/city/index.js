import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity, setlocation } from '../../reduser.js'
import useSWR from 'swr'


export default function City() {
    const [myCitys, setMyCitys] = useState()
    const [selCity, setSelCity] = useState()
    const [findcity, setfindcity] = useState()
    const my_city = useSelector(state => state.counter.city)
    const router = useRouter()
    const ref = useRef()
    const addref = useRef()
    const dispatch = useDispatch()
    const { data, isLoading } = useSWR('/api/get_cities')




    function setMyCity() {
        setfindcity(selCity)
        let new_data = [...data]
        let loc = new_data.filter(i => i.city === selCity)
        dispatch(setcity(selCity))
        dispatch(setlocation([+loc[0].lat, +loc[0].lon]))
        router.back()
    }
    useEffect(() => data?.filter(i => i.city.includes(findcity)), [findcity])
  

    return (
        <>
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

                {data?.filter(i => findcity ? i.city.toLowerCase().includes(findcity.toLowerCase()) : i).sort((a, b) => { return a.city.toLowerCase() < b.city.toLowerCase() ? -1 : 1 }).map(i =>
                    <label className={styles.city} key={i.city}>
                        <div>
                            <b>{i.city}</b>
                            <span>{i.country}</span>
                        </div>      

                        <span className={i.city === selCity ? styles.enabled : styles.disabled}></span>
                        <input type="radio" checked={i.city === selCity} value={selCity} name="city" onChange={() => setSelCity(i.city)} />
                    </label>
                )}
                {isLoading ? <h5>Загружаем города...</h5> : null}


            </section>
        </>
    )
}