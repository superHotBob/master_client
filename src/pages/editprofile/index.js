import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import arrow from '../../../public/arrow_back.svg'
import Navi from '@/components/navi'

const filestyle = { borderRadius: '100%' }
const active_currency = {
    backgroundColor: '#3D4EEA',
    color: '#fff',
}
const passive_currency = {
    backgroundColor: '#fff',
    color: '#000',
    border: '1.5px solid #000',
    borderRadius: '4px',
}

const my_tema = [
    { name: 'Оригинальный', color: ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD'] },
    { name: 'Розовый фламинго', color: ['linear-gradient(90deg, #EA3DC4 0%, #F02A5A 100%)', '#F47BC3', '#FDECF6'] },
    { name: 'Сияние озера', color: ['linear-gradient(93.46deg, #7AB7D9 2.85%, #F4FCFF 50%, #BBD7E0 97.15%)', '#45A1D6', '#F1FCFF'] },
    { name: 'Жаркие барханы', color: ['linear-gradient(94.86deg, #F12711 0%, #F5AF19 100%)', '#ED965B', '#FDF5EC'] },
    { name: 'Зеленый чай', color: ['linear-gradient(94.86deg, #11998E 0%, #78FFD6 100%)', '#2CB69C', '#ECFDFB'] },
    { name: 'Темная ночь', color: ['linear-gradient(94.86deg, #534E9B 0%, #7D78BF 100%)', '#534E9B', '#E5E7F0'] },
    { name: 'Лесной массив', color: ['linear-gradient(94.86deg, #305F53 0%, #71978E 48.96%, #456A61 100%)', '#456A61', '#E1F3EB'] }
]
const my_currency = ['Белорусcкий рубль', 'Российский рубль', 'Казахстанский тенге']
const current_symbol = ['BYN', '₽', '₸']
var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
var token = "5ff295eebd78a454b8bd3805b29d1eb6daefe31f";
var query = { lat: 55.878, lon: 37.653 };





export default function EditProfile() {
    
    const profile = useSelector(state => state.counter.profile)
    const location = useSelector(state=>state.counter.location)
    console.log(location)
    const dispatch = useDispatch()
    const [name, setName] = useState('Ваше имя')
    const [nikname, setNikname] = useState()
    const [file, setSelectedFile] = useState()
    const [text, setText] = useState()
    const [message, setMessage] = useState()
    const [accept, setAccept] = useState(false)
    const [tema, viewTema] = useState(false)
    const [cur, setCur] = useState(false)
    const [color, setColor] = useState(['linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)'])
    const [currency, setCurrency] = useState('Белорусский рубль')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [address_full, setAddress_full] = useState()
   
    useEffect(() => {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({ lat: location[0], lon: location[1] })
        }

        function Location () {
            fetch(url, options)
            .then(response => response.json())
            .then(result => {                
                setCity(result.suggestions[0].data.city.toLowerCase()())
                setAddress(result.suggestions[0].data.street)
                setAddress_full(address_full => ({ ...address_full, ...{ 'дом': result.suggestions[0].data.house } }))
            })
            .catch(error => console.log("error", error));
        }  
        if (profile.status === 'master') { Location() }  
        function SetData() {
            setName(profile.name),
                setText(profile.text),
                setCity(profile.city),
                setCurrency(my_currency[current_symbol.indexOf(profile.currency)]),
                setAddress(profile.address),
                setSelectedFile(profile.image),
                setAddress_full(address_full => ({ ...address_full, ...profile.address_full })),
                setNikname(profile.nikname),
                setColor(profile.color ? profile.color : 'linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)')
        }
        SetData()
    }, [profile.name,
        profile.text,
        profile.city,
        profile.currency,
        profile.address,
        profile.image,
        profile.nikname,
        profile.color,
        profile.address_full
    ])

    function Return() {
        setName(profile.name),
            setText(profile.text),
            setCurrency('Белорусский рубль')
            setSelectedFile(profile.image),
            setAddress(profile.address),
            setNikname(profile.nikname),
            setColor(profile.color || 'linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)')
    }
    const EditClient = async () => {
        const data = {
            status: profile.status,
            name: name,
            new_nikname: nikname,
            image: file,
            text: text,
            old_nikname: profile.nikname
        }
        fetch('/api/editprofileclient', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        .then(res => res.json())
        .then(res =>  {            
            localStorage.setItem("profile", JSON.stringify(res))
            dispatch(setprofile(res))
            setMessage('Ваш профиль изменён')
        })
        .catch(err=>setMessage("Ошибка сохранения "))        
    }
    const EditMaster = async () => {
        const data = {
            status: profile.status,
            name: name,
            new_nikname: nikname,
            image: file,
            text: text,
            old_nikname: profile.nikname,
            currency: current_symbol[my_currency.indexOf(currency)],
            address: address ,
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
        const result = await response.json()
        localStorage.setItem("profile", JSON.stringify(result));
        dispatch(setprofile(result))
        setMessage('Ваш профиль изменён')
    }
    async function CreateMaster() {
        const data = {
            name: name,
            nikname: nikname,
            image: file,
            text: text,
            id: profile.id,
            phone: profile.phone,
            color: my_tema[0],
            currency: 'BYN'
        }
        const response = await fetch('/api/create_master', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const result = await response.json()
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function onSelectFile(a) {
        if (a.size > 50000) {
            setMessage('Файл больше 50кб')
        } else {
            let result = await toBase64(a)
            setSelectedFile(result)
        }

    }


    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <dialog open={message? 'open' : false} className={message ? styles.active_dialog:styles.passive_dialog}>
                    <h6 onClick={() => setMessage()}/>
                    {message}
                </dialog>
                <span onClick={Return} style={{ color: color[1] }}>Отмена</span>
                <span>{profile.nikname}</span>
                <span onClick={profile.status === 'client' ? EditClient : EditMaster} style={{ color: color[1] }}>Принять</span>
            </header>
            <div className={styles.image} style={{ background: color[0] }}>
                {profile.status === 'master' ? <span onClick={() => viewTema(true)}>Изменить обложку</span> : null}
                <div className={styles.profile_image}>
                    <Image
                        src={file ? file : '/camera_wh.svg'}
                        alt="profile"
                        style={file ? filestyle : null}
                        title='заменить изображение'
                        height={file ? 106 : 50}
                        width={file ? 106 : 50}
                    />
                    <input type="file" onChange={(e) => onSelectFile(e.target.files[0])} accept=".jpg,.png,.webp" />
                </div>
            </div>
            <p className={styles.name}>{profile.name || name || 'Ваше имя'}</p>
            <section className={styles.inputs}>
                <h6>
                    <span>Публичная ссылка, никнейм</span>                    
                </h6>
                <div className={styles.nikname}>
                    <span>masters.place/{profile.status + '/'}</span>
                    <input type="text" value={nikname} onChange={e => setNikname(e.target.value)} />
                    {/* <span>{nikname || profile.nikname}</span> */}
                </div>
                <label>
                    Имя и фамилия
                    <input style={{ fontSize: 14 }} type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                {profile.status === 'master' ?
                    <>
                        <h6>
                            <span>Место приема клиентов</span>
                            <span className={styles.change} onClick={() => setAccept(true)}>изменить</span>
                        </h6>
                        <div className={styles.address}>
                            <span>{address}</span>
                        </div>
                    </> : null}
                <label>
                    Краткая информация
                    <textarea value={text} placeholder='Расскажите о себе' rows={3} onChange={e => setText(e.target.value)} />
                </label>
                {profile.status === 'master' ? <>
                    <div className={styles.currency} >
                        Основная валюта
                        <button onClick={() => setCur(true)}>{currency}</button>
                    </div>
                    <div className={styles.tema} style={{ background: color[0] }}>
                        Тема профиля
                        <button onClick={() => viewTema(true)}>Изменить</button>
                    </div></> : null}
                <div className={styles.connect_master}>
                    Аккаунт мастера
                    <button onClick={CreateMaster}>{profile.status === 'master' ? "Подключен" : "Подключить"}</button>
                </div>
            </section>
            {accept ? <div className={styles.submitProfile}>
                <header className={styles.header}>
                    <Image src={arrow} alt="back" onClick={() => setAccept(false)} />
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
                        Город
                        <input style={{ fontSize: 14 }} type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label>
                        Улица
                        <input
                            style={{ fontSize: 14 }}
                            type="text" value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <label>
                        Номер дома
                        <input style={{ fontSize: 14 }}
                            type="text"
                            value={address_full.дом}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'дом': e.target.value } })}
                        />
                    </label>
                    <label className={styles.radio}>
                        Квартира
                        <input type="radio" name="type_house" value="квартира"
                            checked={address_full.тип === "квартира"}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'тип': e.target.value } })}
                        />
                    </label>
                    <label className={styles.radio}>
                        Частный дом
                        <input type="radio" name="type_house" value="частный дом"
                            checked={address_full.тип === "частный дом"}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'тип': e.target.value } })}
                        />
                    </label>
                    <label className={styles.radio}>
                        Комерческое помещение
                        <input type="radio" name="type_house" value="комерческое помещение"
                            checked={address_full.тип === "комерческое помещение"}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'тип': e.target.value } })}
                        />
                    </label>
                    <label>
                        Этаж
                        <input style={{ fontSize: 14 }} type="text" value={address_full.этаж}
                            onChange={(e) => setAddress_full({ ...address_full, ...{ 'этаж': e.target.value } })}
                        />
                    </label>
                    <label>
                        Номер квартиры
                        <input style={{ fontSize: 14 }} type="text" value={address_full.квартира}
                            onChange={(e) => setAddress_full(address_full => ({ ...address_full, ...{ 'квартира': e.target.value } }))}
                        />
                    </label>

                </section>
            </div> : null}
            {tema ?
                <div className={styles.main_tema}>
                    <div className={styles.select_tema}>
                        <h6 onClick={() => viewTema(false)}>Выбор темы</h6>
                        {my_tema.map((i, index) =>
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
            <Navi color={color[1]} />
        </main>
    )
}