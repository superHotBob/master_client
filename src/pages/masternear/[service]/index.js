import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../city/near.module.css'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import useSWR from 'swr'
import CitySelect from '@/components/city'


const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 500
}
export default function MasterNear() {
   
    const router = useRouter()
    const { service } = router.query   
    const city = useSelector((state) => state.counter.city)
    const services = useSelector((state) => state.counter.service)   
       
   

    const { data, error, isLoading } = useSWR('/api/all_masters_city?' + new URLSearchParams({
        city: city.toLowerCase(),
        service:  service})
    )
    
    useEffect(()=>{router.push(`/masternear/${services}`)},[services]) 
   
    return (
        <>
            <Header sel="/catalog" text="Мастера рядом " />
            <div className={styles.message}>
                <Message page="masternear" text='Masters.place позволяет познакомиться  с 
                    мастерами вашего города. Для этого нужно выбрать 
                    ваш город, что бы увидеть список мастеров.'
                />
            </div>
            <div style={{margin: '0 16px'}}>
                <CitySelect city={city} />
            </div>            
            <div className={styles.selector}>                
                <Link href={`/masternear/${service}`} style={sel}>Список</Link>
                <Link href="/masternear/city" >На карте</Link>
            </div>
            <section className={styles.section} >
                <FilterServices />
                {data?.map(i =>
                    <Link key={i.name} className={styles.master} href={'/' + i.nikname}>
                        <div>
                        <p>
                            <b>{i.name}</b>
                            <span className={styles.pro}>MASTER</span>
                            {i.stars != 0.0 ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}</h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                        </div>
                        <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="image" />
                    </Link>
                )}
                {isLoading?<p className={styles.message__await}>Загружаем мастеров...</p>:null}
                {error?<p className={styles.message__await}>Ошибка загрузки мастеров...</p>:null}
            </section>
        </>
    )
}