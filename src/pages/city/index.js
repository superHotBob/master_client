import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back_bold.svg'
import { useState,  useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setcity, setlocation } from '../../reduser.js'



export default function City({data}) {   
    const [selCity, setSelCity] = useState()
    const [findcity, setfindcity] = useState()   
    const router = useRouter()   
    const dispatch = useDispatch()


   




    async function setMyCity() {
        setfindcity(selCity)
        // let new_data = [...data]
        // let loc = new_data.filter(i => i.city === selCity)
        const res = await fetch(`/api/get_citi_coord?city=${selCity}`)
        const data = await res.json()
        dispatch(setcity(selCity))
        dispatch(setlocation([+data[0].lat, +data[0].lon]))
        router.back()
    }
    useEffect(() => {
        data?.filter(i => i.city.includes(findcity))
    }, [findcity])
   
   
   

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
               


            </section>
        </>
    )
}

export async function getServerSideProps() {    
    
    const res = await fetch('http://localhost:3000/api/get_cities')
    const data = await res.json()
   
    return { props: { data } }
  }