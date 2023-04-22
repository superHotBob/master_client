import Image from 'next/image'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back.svg'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setcity, setlocation } from '../../reduser.js'

const citys = ['Минск', 'Брест','Гродно']

export default function City() {
    const [myCitys, setMyCitys] = useState(citys)
    const [city, setCity] = useState()
    const [selCity, setSelCity] = useState()
    const router = useRouter()
    const ref = useRef()    
    const dispatch = useDispatch()

    const location = {
        минск: [53.89565757721091, 27.545348010833237 ],
        брест: [52.09788450736236, 23.732067465489514] ,
        гродно: [53.670572646682174, 23.82749392191836]
    }
        
    function setMyCity() {
        ref.current.value = selCity
        dispatch(setcity(selCity))
        dispatch(setlocation(location[selCity.toLowerCase()]))
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