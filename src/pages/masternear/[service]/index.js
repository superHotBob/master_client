import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setmaster, setservice } from '@/reduser'
import { useState, useEffect } from 'react'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import useSWR from 'swr'
const url = 'https://masters-client.onrender.com/'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 500
}
export default function MasterNear() {
   
    const router = useRouter()
    const { service } = router.query   
    const my_city = useSelector((state) => state.counter.city)
    const services = useSelector((state) => state.counter.service)   
    const dispatch = useDispatch()      
   

    const { data, error, isLoading } = useSWR('/api/all_masters_city?' + new URLSearchParams({
        city: my_city.toLowerCase(),
        service:  service}))
    
    useEffect(()=>{
       router.push(`/masternear/${services}`)
       
        },[services])

    // function ViewNewMaster(a) {
    //     router.push(`/${a}`)
    //     let master = data.filter(i => i.nikname === a)
    //     dispatch(setmaster(master[0]))
    // }   
   
    return (
        <>
            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message page="masternear" text={` Masters.place позволяет познакомиться  с 
                    мастерами вашего города. Для этого нужно выбрать 
                    ваш город, что бы увидеть список мастеров.
                `} />
            </div>
            <Link className={styles.city} href='/city'>Ваш город {my_city}</Link>
            <div className={styles.selector}>
                <Link href={`/masternear/${service}`} style={sel}>Список</Link>
                <Link href="/masternear/city" >На карте</Link>
            </div>
            <section className={styles.section} >
                <FilterServices />
                {data?.map(i =>
                    <Link key={i.name} className={styles.master} href={'/' + i.nikname}>
                        <p className={styles.name_stars} >
                            <span>{i.name}</span>
                            <span className={styles.pro}>MASTER</span>
                            {i.stars != 0.0 ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        <Image src={url + 'var/data/' + i.nikname + '/main.jpg'} width={60} height={60} alt="image" />
                    </Link>
                )}
                {isLoading?<p className={styles.message__await}>Загружаем мастеров...</p>:null}
                {error?<p className={styles.message__await}>Ошибка загрузки мастеров...</p>:null}
            </section>
        </>
    )
}