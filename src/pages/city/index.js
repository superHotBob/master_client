import Image from 'next/image'
import Link from 'next/link'
import styles from './city.module.css'
import arrow from '../../../public/arrow_back.svg'
import { useState } from 'react'
import { useRouter } from 'next/router'

const city = ['Москва','Минск','Брест','Гродно','Саратов','Новосибирск']
export default function City() {
    const [myCitys, setMyCitys] = useState(city)
    const router = useRouter()
    function selectCity(e) {
        console.log(e.target.value);
        if (e.target.value) {
            let cc = myCitys.filter(i => i.includes(e.target.value)?i : null)

            setMyCitys(cc)
        } else {
            setMyCitys(city)
        }
        
       
        
    }
    return (
        <div className={styles.main}>
            <header className={styles.headers}>
                
                    <Image src={arrow} alt="back" onClick={()=>router.back()}/>
               
                <span>Выбор города</span>
                <span>Принять</span>

            </header>
            <section className={styles.section}>
                <input type="text" placeholder='Ваш город' onChange={(e)=>selectCity(e)}/>
                {myCitys.map(i=><div className={styles.city} key={i}>
                    <span>{i}</span>
                    <input type="radio" value={i} name="city" />
                </div>)}
            </section>
        </div>
    )
}