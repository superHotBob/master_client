import Header from '@/components/header'
import { useRouter } from 'next/router'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './service.module.css'
import position from '../../../../public/position.svg'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'

const style = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA'
}
export default function Service() {
    const router = useRouter()  
    const { pid } = router.query
    const [masters, setMasters] = useState()
    useEffect(() => {
        async function GetMasters() {
            const response = await fetch('/api/all_masters?'+ new URLSearchParams({
                service: pid                
            }))           
            const result = await response.json()
            setMasters(result)
            console.log(result)
        }
        GetMasters()

    }, [])
   
 
   

    return (
        <div className={styles.main}>
            <Header sel="/catalog" text="Мастера рядом" />
            <section className={styles.section}>
                <Message text={` Masters.place показывает самые крутые и 
                    актуальные работы мастеров в вашем городе. Вы 
                    можете выбрать понравившуюся работу и написать
                    мастеру!
                `} />               
                <div className={styles.city}>
                    <Link href="/city"> Выбрать ваш город</Link>
                    <Image alt="Picture of the author" src={position} width={20} height={20} />
                </div>
                <FilterServices />
                {masters ? <>
                    {masters.map(i =>
                        <div 
                            key={i.name} 
                            className={styles.master} 
                            style={{ backgroundImage: "url(" + i.image + "" }}
                        >
                            <Link href={"/master/" + i.nikname}>
                                <p>
                                    <span>{i.name}</span>
                                    <span className={styles.pro}>MASTER</span>
                                    <span className={styles.stars}>{i.stars}</span>
                                </p>
                            </Link>
                            <h4>{i.address}</h4>
                            <h5>{i.services.map(m=><span key={m}>{m}</span>)}</h5>

                        </div>
                    )}
                    </> : null}

            </section>
           
        </div>



    )
}