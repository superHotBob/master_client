import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './near.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setmaster } from '@/reduser'
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
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const router = useRouter()   
    const my_city = useSelector((state) => state.counter.city)
    const service = useSelector((state) => state.counter.service)   
    const dispatch = useDispatch()      
    const [masters, setMasters] = useState()

    const { data, error, isLoading } = useSWR('/api/all_masters_city?' + new URLSearchParams({
        city: my_city.toLowerCase(),
        service: service ? service : pid}), fetcher)
    
    // useEffect(() => {
    //     // const { pathname } = window.location
    //     // setSelector(pathname.replace('/masternear/', ''))
    //     // setMasters()
    //     fetch('/api/all_masters_city?' + new URLSearchParams({
    //         city: my_city.toLowerCase(),
    //         service: service ? service : pid
    //     }), { next: { revalidate: 100 } })
    //         .then(res => res.json())
    //         .then(data => setMasters(data))
    // }, [service])   

    function ViewNewMaster(a) {
        router.push(`/${a}`)
        let master = data.filter(i => i.nikname === a)
        dispatch(setmaster(master[0]))
    }   
   
    return (
        <div className={styles.main}>
            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message text={` Masters.place позволяет познакомиться  с 
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
                    <div key={i.name} className={styles.master} onClick={() => ViewNewMaster(i.nikname)}>
                        <p className={styles.name_stars} >
                            <span>{i.name}</span>
                            <span className={styles.pro}>MASTER</span>
                            <span className={styles.stars}>{i.stars}</span>
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        <Image src={url + 'var/data/' + i.nikname + '/main.jpg'} width={60} height={60} alt="image" />
                    </div>
                )}
                {isLoading?<p className={styles.message__await}>Загружаем мастеров...</p>:null}
                {error?<p className={styles.message__await}>Ошибка загрузки мастеров...</p>:null}
            </section>
        </div >
    )
}