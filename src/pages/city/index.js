import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back.svg'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity, setlocation } from '../../reduser.js'
import useSWR from 'swr'

const citys = ['Минск', 'Брест','Гродно']
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function City() {
    const [myCitys, setMyCitys] = useState(citys)
    const [selCity, setSelCity] = useState()
    const [findcity, setfindcity] = useState()
    const my_city = useSelector(state=>state.counter.city)
    const router = useRouter()
    const ref = useRef()
    const addref = useRef()    
    const dispatch = useDispatch()
    const { data, error, isLoading } = useSWR('/api/get_cities', fetcher)
   
    useEffect(()=>{        
        // setSelCity(my_city)
      
        
    },[])

   
        
    function setMyCity() {
        setfindcity(selCity)
        let new_data = [...data]
        let loc = new_data.filter(i=>i.city === selCity)
        console.log([+loc[0].lat,+loc[0].lon])
        dispatch(setcity(selCity))
        dispatch(setlocation([+loc[0].lat,+loc[0].lon]))
    }
    function selectCity(e) {       
        if (e.target.value) {
            let cc = myCitys.filter(i => i.toLowerCase().includes(e.target.value) ? i : null)
            setMyCitys(cc)
        } else {
            setMyCitys(citys)
        }
    }
    const AddCity = () => {
        fetch(`https://api.api-ninjas.com/v1/geocoding?city=${addref.current.value}&country=BY`,
        {
        headers: { 'X-Api-Key': 'xxDz7cf1MDoWKvKJ7p9uLA==msmQGP675Gxdy2i4'},
        contentType: 'application/json'})
        .then(res=>console.log(res[0]))
    }
    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <span>Выбор города</span>
                <span onClick={setMyCity}>Принять</span>
            </header>
            <input 
                className={styles.seachcity} 
                type="search"               
                value={findcity}
                placeholder='Ваш город'                            
                onChange={(e)=>setfindcity(e.target.value)} 
            />
            <section className={styles.section}>               
                {data?.sort((a,b)=>{ return a.city.toLowerCase() < b.city.toLowerCase() ?-1:1}).map(i =>
                    <label className={styles.city} key={i}>
                        <span>{i.city}</span>
                        <input type="radio" checked={i.city === selCity} value={selCity} name="city" onClick={() => setSelCity(i.city)} />
                    </label>
                )}
                <div
                >Нет в списке. 
                <p>Добавить город</p>
                <input className={styles.seachcity} ref={addref} type="text" />
                <button onClick={AddCity} className={styles.seachcity}>Добавить</button>
                </div>
            </section>
        </div>
    )
}