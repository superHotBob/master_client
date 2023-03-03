import Image from 'next/image'

import styles from './city.module.css'
import arrow from '../../../public/arrow_back.svg'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity } from '../../reduser.js'

const citys = ['Москва','Минск','Брест','Гродно','Саратов','Новосибирск']

export default function City() {
    const [myCitys, setMyCitys] = useState(citys)
    const [city, setCity] = useState()
    const [selCity, setSelCity] = useState()
    const router = useRouter()
    const ref = useRef()
    const my_city = useSelector((state) => state.counter.city)
    const dispatch = useDispatch()


    function setMyCity() {
        ref.current.value = selCity
        dispatch(setcity(selCity))
    }
    function selectCity(e) {
        console.log(e.target.value);
        if (e.target.value) {
            let cc = myCitys.filter(i => i.toLowerCase().includes(e.target.value)?i : null)

            setMyCitys(cc)
        } else {
            setMyCitys(citys)
        }
        
       
        
    }
    return (
        <div className={styles.main}>
            <header className={styles.headers}>                
                <Image src={arrow} alt="back" onClick={()=>router.back()}/>               
                <span>Выбор города</span>
                <span onClick={setMyCity}>Принять</span>
            </header>           
            <section className={styles.section}>
                <input type="search" ref={ref} placeholder='Ваш город' defaultValue={selCity} value={city} onChange={selectCity}/>
                {myCitys.map(i=><div className={styles.city} key={i}>
                    <span>{i}</span>
                    <input type="radio" value={i} name="city" onClick={(e)=>setSelCity(e.target.value)} />
                </div>)}
            </section>
        </div>
    )
}