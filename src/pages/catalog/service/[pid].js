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
import { useDispatch, useSelector } from 'react-redux'
import { setservice } from '../../../reduser'


const style = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA'
}
export default function Service() {
    const router = useRouter() 
    const service = useSelector(state=>state.counter.service)   
    const { pid } = router.query
    
   
    const [masters, setMasters] = useState()

    useEffect(() => {
        setMasters()
        async function GetMasters() {
            const response = await fetch('/api/all_masters_service?'+ new URLSearchParams({
                service: service                
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
                <FilterServices  service={pid}/>
                {masters ? <>
                    {masters.map(i =>
                        <div 
                            key={i.name} 
                            className={styles.master} 
                            style={{ backgroundImage: "url(" + i.image + ")" }}
                        >
                            <Link href={"/master/" + i.nikname}>
                                <p>
                                    <span className={styles.name}>{i.name}</span>
                                    <span className={styles.pro}>MASTER</span>
                                    <span className={styles.stars}>{i.stars}</span>
                                </p>
                            </Link>
                            <h4>{i.address}</h4>
                            {i.services?.length ? <h5>{i.services.map(m=><span key={m}>{m}</span>)}</h5> :null}

                        </div>
                    )}
                    </> 
                    : 
                    <div className={styles.await}>                       
                        <Image alt="await" src='/await.gif' width={150} height={150}/>
                    </div>
                }    
            </section>
           
        </div>



    )
}