import Header from '@/components/header'
import { useRouter } from 'next/router'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './service.module.css'
import close from '../../../../public/close.svg'
import position from '../../../../public/position.svg'
import location from '../../../../public/location.svg'
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
   
    const img = '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'
   

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
                            style={{ backgroundImage: "url(/image/" + i.image + ".jpg)" }}
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