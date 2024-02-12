import Location from '@/components/location'
import styles from '../editprofile.module.css'
import Image from 'next/image'
import arrow from '../../../../public/arrow_back.svg'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { EDGE_UNSUPPORTED_NODE_APIS } from 'next/dist/shared/lib/constants'



export default function Address() {

    const { location, mystate , nikname } = useSelector((state) => state.counter)
   
   
    const [city, setCity] = useState('')
   
    const [street, setstreet] = useState()
    const [address_full, setAddress_full] = useState({})

    const [view_Loc, set_View_Loc] = useState(false)

   

    useEffect(() => {
        
        let { city, address, address_full } = JSON.parse(localStorage.getItem('profile'))      
            setCity(city ? city : 'минск')           
            // setAddress(address)
            setAddress_full(address_full)          
            setstreet(address?.split(',').length === 3 ? address?.split(',')[1] : address?.split(',')[2])
       
    }, [])
  
    function SetAddressFull(e) {
        setAddress_full({ ...address_full, ...{ 'тип': e.target.value } })
    }
   

    return (
        <>
            <header className={styles.header}>
                <Link href="/editprofile">
                    <Image src={arrow} alt="back" />
                </Link>
                <h4>Адрес приема клиентов</h4>
                <button onClick={() => set_View_Loc(true)}>Принять</button>
            </header>
            <section className={styles.inputs}>
                <label>
                    Выберите регион
                    <Link href="/states">{mystate.charAt(0).toUpperCase() + mystate.slice(1)}</Link>                    
                </label>
                <label>
                    Введите город
                    <input
                        type="text" 
                        value={city}
                        className={styles.city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='например Минск, Ростов , Москва'
                    />
                </label>
                <label>
                    Проспект, улица, переулок, тракт
                    <input
                        type="text" value={street}
                        onChange={(e) => setstreet(e.target.value)}
                        placeholder='улица Ленина, проспект Независимости, переулок Будёного'
                    />
                </label>
                <label>
                    Номер дома / корпус
                    <input
                        type="text"
                        value={address_full?.дом}
                        onChange={(e) => setAddress_full({ ...address_full, ...{ 'дом': e.target.value } })}
                    />
                </label>
                <p>Следущие данные видны только клиенту после заказа</p>
                <label className={styles.radio}>
                    Квартира
                    <input type="radio" name="type_house" value="квартира"
                        checked={address_full?.тип === "квартира"}
                        onChange={SetAddressFull}
                    />
                </label>
                <label className={styles.radio}>
                    Частный дом
                    <input type="radio" name="type_house" value="частный дом"
                        checked={address_full?.тип === "частный дом"}
                        onChange={SetAddressFull}
                    />
                </label>
                <label className={styles.radio}>
                    Комерческое помещение
                    <input type="radio" name="type_house" value="комерческое помещение"
                        checked={address_full?.тип === "комерческое помещение"}
                        onChange={SetAddressFull}
                    />
                </label>
                <label>
                    Этаж
                    <input type="text" value={address_full?.этаж}
                        onChange={(e) => setAddress_full({ ...address_full, 'этаж': e.target.value })}
                    />
                </label>
                <label>
                    Номер квартиры
                    <input type="text" value={address_full?.квартира}
                        onChange={(e) => setAddress_full({ ...address_full, 'квартира': e.target.value })}
                    />
                </label>
                <button className={styles.location} onClick={() => set_View_Loc(true)}>
                    Выбрать локацию
                </button>
            </section>
            {view_Loc ? <Location
                city={city}
                state={mystate}
                close={set_View_Loc}
                nikname={nikname}
                loc_master={location}                            
                address_total={address_full}
                place={mystate + ' , ' + city + ' , ' + street + ' , ' + address_full?.дом}
            /> : null}

        </>
    )
}