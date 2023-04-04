import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back.svg'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity } from '../../reduser.js'

const citys = ['Минск', 'Брест']

export default function City() {
    const [myCitys, setMyCitys] = useState(citys)
    const [city, setCity] = useState()
    const [selCity, setSelCity] = useState()
    const router = useRouter()
    const ref = useRef()    
    const dispatch = useDispatch()


    function setMyCity() {
        ref.current.value = selCity
        dispatch(setcity(selCity))
    }
    function selectCity(e) {       
        if (e.target.value) {
            let cc = myCitys.filter(i => i.toLowerCase().includes(e.target.value) ? i : null)

            setMyCitys(cc)
        } else {
            setMyCitys(citys)
        }



    }
    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <span>Выбор города</span>
                <span onClick={setMyCity}>Принять</span>
            </header>
            <input className={styles.seachcity} type="search" ref={ref} placeholder='Ваш город' defaultValue={selCity} value={city} onChange={selectCity} />
            <section className={styles.section}>               
                {myCitys.sort().map(i =>
                    <label className={styles.city} key={i}>
                        {i}
                        <input type="radio" value={i} name="city" onClick={(e) => setSelCity(e.target.value)} />
                    </label>
                )}
            </section>
        </div>
    )
}