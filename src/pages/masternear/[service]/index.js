import Header from '@/components/header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../city/near.module.css'
import { setservice } from '../../../reduser'
import { useSelector, useDispatch } from 'react-redux'
import FilterServices from '@/components/filterServices'
import Message from '@/components/message'
import useSWR from 'swr'
import { useEffect } from 'react'




const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    color: '#fff',
    fontWeight: 500,
    cursor: 'default'
}
export default function MasterNear() {
    const dispatch = useDispatch()
    const router = useRouter() 
    useEffect(()=> {
    dispatch(setservice(router.query.service ? router.query.service : 'маникюр'))
    return () => console.log(router.query.service)
    },[])   
    
    const { mystate, service } = useSelector((state) => state.counter)

    const { data, error, isLoading } = useSWR('/api/all_masters_city?' + new URLSearchParams({
        city: mystate.toLowerCase(),
        service: service
    }), { onSuccess: () => router.push(`/masternear/${service}`)})
        
  

    return (
        <>
            <Header sel="/" text="Мастера рядом " />
            <Message page="masternear" text='Masters.place позволяет познакомиться  с 
                мастерами вашего города. Для этого нужно выбрать 
                ваш город, что бы увидеть список мастеров.'
            />
            <Link className={styles.city} href='/states'> 
                {mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}
            </Link>
            <span className={styles.selector_one} style={sel}>Список</span>
            <Link className={styles.selector_two} href="/masternear/city" >На карте</Link>
            <FilterServices />
            {data?.map(i =>
                <Link key={i.name} className={styles.master} href={'/' + i.nikname}>
                    <div>
                        <p>
                            <b>{i.name}</b>
                            <span className={styles.pro}>MASTER</span>                            
                            {i.stars != 0.0 ? <span className={styles.stars}>{i.stars}</span> : null}
                        </p>
                        <h4>{i.address}
                        {i.remotely && <Image className={styles.remotely} src="/bus.svg" title='возможен выезд' width={25} height={20} alt="image" /> }
                        </h4>
                        <h5>{i.services.map(a => <span key={a} className={styles.service}>{a}</span>)}</h5>
                    </div>
                    <Image src={process.env.url_image + i.nikname + '.jpg'} width={60} height={60} alt="image" />
                </Link>
            )}
            {isLoading ? <p className={styles.message__await}>Загружаем мастеров...</p> : null}
            {error ? <p className={styles.message__await}>Ошибка загрузки мастеров...</p> : null}
        </>
    )
}