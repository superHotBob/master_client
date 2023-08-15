import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setlocation, setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import arrow from '../../../public/arrow_back.svg'
import Navi from '@/components/navi'
import { useGeolocated } from "react-geolocated"
import { useRouter } from 'next/router'
import Location from '@/components/location'
import useSWR from 'swr'
import Link from 'next/link'
const fetcher = (...args) => fetch(...args).then(res => res.json())
import { my_data } from '@/data.'

const active_currency = {
    backgroundColor: '#3D4EEA',
    color: '#fff',
    zIindex: 200
}
const passive_currency = {
    backgroundColor: '#fff',
    color: '#000',
    border: '1.5px solid #000',
    borderRadius: '4px',
    zIndex: 200
}


const my_currency = ['Белорусcкий рубль', 'Российский рубль', 'Казахстанский тенге']
const current_symbol = ['BYN', '₽', '₸']
const url = 'https://masters-client.onrender.com'
export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const location = useSelector(state => state.counter.location)
    const router = useRouter()

    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [nikname, setNikname] = useState()
    const [text, setText] = useState()
    const [file, setSelectedFile] = useState('/camera_wh.svg')
    const [file_for_upload, set_file_for_upload] = useState(null)

    const [message, setMessage] = useState()
    const [master_address, setMasterAddress] = useState(false)
    const [tema, viewTemaBlock] = useState(false)
    const [cur, setCur] = useState(false)
    const [color, setColor] = useState(my_data.my_tema[0].color)
    const [currency, setCurrency] = useState('BYN')
    const [city, setCity] = useState('Минск')
    const [address, setAddress] = useState()
    const [address_full, setAddress_full] = useState()
    const [loc, selectLoc] = useState(false)
    const { data } = useSWR('/api/get_cities', fetcher)
   

   
   function handleLocation(event) {  
    if(event.target.value !=='0'){  
        setCity(event.target.value)
        let loc = data.filter(i=>i.city.toLowerCase()===event.target.value).map(i=>i.lat + ',' + i.lon)[0].split(',')
        
        dispatch(setlocation(loc))
    }
    
   }
    
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem('profile'))
        if (!pro) {
            return () => router.push('/enter')
        }else {
            setName(pro.name),
            setText(pro.text),
            setCity(pro.city),
            setCurrency(my_currency[current_symbol.indexOf(pro.currency)] ?? 'Белорусский рубль'),
            setAddress(pro.address)
            setSelectedFile(url + '/var/data/' + pro.nikname + '/main.jpg')
            setAddress_full(address_full => ({ ...address_full, ...pro.address_full })),
            setNikname(pro.nikname),
            setColor(pro.color ? pro.color : my_tema[0])
        }

    }, [])
    function Return() {
        let pro = JSON.parse(localStorage.getItem('profile'))
        setName(pro.name),
        setText(pro.text),
        setCurrency('Белорусский рубль')
        setSelectedFile(url + '/var/data/' + pro.nikname + '/main.jpg')
        setAddress(pro.address),
        setNikname(pro.nikname),
        setColor(pro.color)
        router.push(`/${pro.nikname}`)
    }
    const EditMaster = async () => {
        const data = {
            status: profile.status,
            name: name,           
            text: text,
            nikname: nikname,
            currency: current_symbol[my_currency.indexOf(currency)],
            address: address,
            city: city,
            color: color,
            locations: location,
            address_full: address_full
        }
        const response = await fetch('/api/editprofilemaster', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (file_for_upload) { UploadToServer() }
        const result = await response.json()
        localStorage.setItem("profile", JSON.stringify(result));
        dispatch(setprofile(result))
        // setMessage('Ваш профиль изменён')
        
    }
   
    function SelectUpload(e) {        
        let url = URL.createObjectURL(e.target.files[0])
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
    }
    function SetAddressFull(e) {
        setAddress_full({ ...address_full, ...{ 'тип': e.target.value } })
    }

    function UploadToServer() {        
        let data = new FormData()
        data.append('file', file_for_upload, 'main.jpg')
        fetch(`${url}/upl?name=${profile.nikname}`, {
            body: data,
            method: 'post',
        }).then(res => console.log('file is good'))
        setSelectedFile(url + '/var/data/' + profile.nikname + '/main.jpg')
    }
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <dialog
                    onClick={() => setMessage()}
                    open={message ? 'open' : false}
                    className={message ? styles.active_dialog : styles.passive_dialog}
                >
                    <b className={styles.message}>{message}</b>
                </dialog>
                <span onClick={Return} style={{ color: color[1] }}>Отмена</span>
                <span>{nikname}</span>
                <span onClick={EditMaster} style={{ color: color[1] }}>Принять</span>
            </header>
            <div className={styles.image} style={{ background: color[0] }}>
                <span onClick={() => viewTemaBlock(true)}>Изменить обложку</span>
                <form  className={styles.profile_image}>
                    <Image
                        src={file}
                        alt="фото"
                        style={{ transform: 'translate(0)' }}
                        title='заменить изображение'
                        height={106}
                        width={106}
                    />
                    <input
                        title="Клик для выбора изображения"
                        type="file"
                        name="image"
                        style={{ transform: 'translateY(-106px)' }}
                        onChange={(e) => SelectUpload(e)}
                        accept=".jpg"
                    />
                </form>

            </div>
            <p className={styles.name}>{profile.name || name || 'Ваше имя'}</p>
            <section className={styles.inputs}>
                <h6>
                    <span>Публичная ссылка, никнейм</span>
                    <Link className={styles.change} href="/editnikname">Изменить</Link>
                </h6>
                <div className={styles.nikname}>
                    <span>masters.place/</span>
                    <input disabled type="text" value={nikname} onChange={e => setNikname(e.target.value)} />                    
                </div>
                <label>
                    Имя и фамилия
                    <input style={{ fontSize: 14 }} type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                <h6>
                    <span>Место приема клиентов</span>
                    <span className={styles.change} onClick={() => setMasterAddress(true)}>Изменить</span>
                </h6>
                <div className={styles.address}>
                    <span>{address}{' , '}{address_full?.дом}</span>
                </div>
                <label>
                    Краткая информация
                    <textarea value={text} placeholder='Расскажите о себе' rows={3} onChange={e => setText(e.target.value)} />
                </label>

                <div className={styles.currency} >
                    Основная валюта
                    <button onClick={() => setCur(true)}>{currency}</button>
                </div>
                <div className={styles.tema} style={{ background: color[0] }}>                    
                    <button onClick={() => viewTemaBlock(true)}>Изменить</button>
                </div>
                <div className={styles.connect_master} />               
            </section>
            {master_address ? 
                <div className={styles.submitProfile}>
                <header className={styles.header}>
                    <Image src={arrow} alt="back" onClick={() => setMasterAddress(false)} />
                    <h4>Адрес приема клиентов</h4>
                    <span style={{ opacity: 0 }}>Пр</span>
                </header>
                <p>{`Укажите настоящее имя и фамилию, что бы лояльно 
                    расположить мастеров или клиентов к вам. 
                    Это поможет сделать наш сервис более настоящим.
                    `}
                </p>
                <section className={styles.inputs}>
                    <label>
                       Выберите город
                        <select value={city} className={styles.select} onChange={handleLocation}>
                            {data?.map(i=><option key={i.city} value={i.city.toLowerCase()}>
                                {i.city}
                                </option>
                            )}
                            <option value={0}>Нет в списке</option>
                        </select>
                        {/* <input style={{ fontSize: 14 }} type="text" value={city} onChange={(e) => setCity(e.target.value)} /> */}
                    </label>
                    <label>
                        Улица
                        <input                           
                            type="text" value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        Номер дома
                        <input 
                            type="text"
                            value={address_full.дом}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'дом': e.target.value } })}
                        />
                    </label>
                    <label className={styles.radio}>
                        Квартира
                        <input type="radio" name="type_house" value="квартира"
                            checked={address_full.тип === "квартира"}
                            onChange={SetAddressFull}
                        />
                    </label>
                    <label className={styles.radio}>
                        Частный дом
                        <input type="radio" name="type_house" value="частный дом"
                            checked={address_full.тип === "частный дом"}
                            onChange={SetAddressFull}
                        />
                    </label>
                    <label className={styles.radio}>
                        Комерческое помещение
                        <input type="radio" name="type_house" value="комерческое помещение"
                            checked={address_full.тип === "комерческое помещение"}
                            onChange={SetAddressFull}
                        />
                    </label>
                    <label>
                        Этаж
                        <input  type="text" value={address_full.этаж}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'этаж': e.target.value } })}
                        />
                    </label>
                    <label>
                        Номер квартиры
                        <input  type="text" value={address_full.квартира}
                            onChange={(e) => setAddress_full(address_full => ({ ...address_full, ...{ 'квартира': e.target.value } }))}
                        />
                    </label>
                </section>
                <div className={styles.place} >
                    <h4 onClick={() => selectLoc(true)}>
                        Выбрать локацию
                        {loc ? <> <b>[{(+location[0]).toFixed(4)}</b>,<b>{(+location[1]).toFixed(4)}]</b></>: null}
                    </h4>
                </div>
                {loc ? <Location nikname={profile.nikname} loc_master={location} close={selectLoc} /> : null}
            </div> : null}
            {tema ?
                <div className={styles.main_tema}>
                    <div className={styles.select_tema}>
                        <h6 onClick={() => viewTemaBlock(false)}>Выбор темы</h6>
                        {my_data.my_tema.map((i, index) =>
                            <div
                                key={i.name}
                                onClick={() => setColor(i.color)}
                                style={{ background: i.color[0] }}
                            >
                                <span style={{ color: index === 2 ? 'black' : 'white' }} className={i.color[0] === color[0] ? styles.selected_tema : null}>
                                    {i.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                : cur ?
                    <div className={styles.main_tema}>
                        <div className={styles.select_tema}>
                            <h6 onClick={() => setCur(false)} />
                            {my_currency.map((i, index) =>
                                <div
                                    key={i}
                                    onClick={() => setCurrency(i)}
                                    style={currency === i ? active_currency : passive_currency}
                                >
                                    <span className={currency === i ? styles.selected_tema : null}
                                        style={currency === i ? active_currency : { color: '#000' }}
                                    >
                                        {i}
                                    </span>

                                    {index === 0 && <span className={styles.img_currency} style={{ fontSize: 20, color: currency === i ? '#fff' : '#000' }}>BYN</span>}
                                    {index === 1 && <span className={styles.img_currency} style={{ fontSize: 20, color: currency === i ? '#fff' : '#000' }}>₽</span>}
                                    {index === 2 && <span className={styles.img_currency} style={{ fontSize: 20, color: currency === i ? '#fff' : '#000' }}>₸</span>}

                                </div>
                            )}
                        </div>
                    </div> : null}
            
        </main>
    )
}