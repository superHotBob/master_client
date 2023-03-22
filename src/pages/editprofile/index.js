import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import arrow from '../../../public/arrow_back.svg'


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
    { name: 'Оригинальный', color: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)' },
    { name: 'Розовый фламинго', color: 'linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)' },
    { name: 'Сияние озера', color: 'linear-gradient(93.46deg, #C6FFDD 2.85%, #FBD786 49.02%, #F7797D 97.15%)' },
    { name: 'Жаркие барханы', color: 'linear-gradient(94.86deg, #F12711 0%, #F5AF19 100%)' },
    { name: 'Зеленый чай', color: 'linear-gradient(94.86deg, #11998E 0%, #78FFD6 100%, #38EF7D 100%)' },
    { name: 'Темная ночь', color: 'linear-gradient(94.86deg, #0F0C29 0%, #302B63 48.96%, #24243E 100%)' },
    { name: 'Лесной массив', color: 'linear-gradient(94.86deg, #0F2027 0%, #203A43 48.96%, #222222 100%)' }
]
const my_currency = ['Белорусcкий рубль', 'Российский рубль', 'Казахстанский тенге']


export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const dispatch = useDispatch()
    const [name, setName] = useState('Ваше имя')
    const [nikname, setNikname] = useState()
    const [file, setSelectedFile] = useState()
    const [text, setText] = useState()
    const [accept, setAccept] = useState(false)
    const [tema, viewTema] = useState(false)
    const [cur, setCur] = useState(false)
    const [color, setColor] = useState('linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)')
    const [currency, setCurrency] = useState('Белорусский рубль')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [address_full, setAddress_full] = useState()

    useEffect(() => (
        setName(profile.name),
        setText(profile.text),
        setCity(profile.city),
        setCurrency(profile.currency),
        setAddress(profile.address),
        setSelectedFile(profile.image),
        setAddress_full(address_full=>({...address_full,...profile.address_full})),
        setNikname(profile.nikname),
        setColor(profile.color || 'linear-gradient(94.86deg, #3D6DEA 0%, #F49ED2 48.96%, #FD3394 100%)')
    ), [])

    function Return() {
        setName(profile.name),
            setText(profile.text),
            setCurrency('Белорусский рубль')
            setSelectedFile(profile.image),
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
        const response = await fetch('/api/editprofileclient', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const result = await response.json()
        localStorage.setItem("profile", JSON.stringify(result));
        dispatch(setprofile(result))
    }
    const EditMaster = async () => {
        const data = {
            status: profile.status,
            name: name,
            new_nikname: nikname,
            image: file,
            text: text,
            old_nikname: profile.nikname,
            currency: currency,
            color: color,
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
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function onSelectFile(a) {
        if (a.size > 50000) {
            console.log("Size is big")
        } else {
            let result = await toBase64(a)
            setSelectedFile(result)
        }

    }
    return (
        <main className={styles.main}>
            {/* <Header sel={"/" + profile.status + "/" + profile.nikname} text={profile.nikname} /> */}
            <header className={styles.header}>
                {/* <Image src={arrow} alt="back" onClick={() => setAccept(false)} /> */}
                <span onClick={Return}>Отмена</span>
                <span>{profile.nikname}</span>
                <span onClick={profile.status === 'client' ? EditClient : EditMaster}>Принять</span>
            </header>
            <div className={styles.image} style={{ background: color }}>
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
                    <input type="file" onChange={(e) => onSelectFile(e.target.files[0])} accept=".jpg,.png" />
                </div>
            </div>
            <p className={styles.name}>{profile.name || name || 'Ваше имя'}</p>
            <section className={styles.inputs}>
                <h6>
                    <span>Публичная ссылка, никнейм</span>
                    {/* <span onClick={() => setAccept(true)}>изменить</span> */}
                </h6>
                <div className={styles.nikname}>
                    <span>masters.place/{profile.status}/</span>
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
                    <div className={styles.tema} style={{ background: color }}>
                        Тема профиля
                        <button onClick={() => viewTema(true)}>Изменить</button>
                    </div></> : null}
                <div className={styles.connect_master}>
                    Аккаунт мастера
                    <button>{profile.status === 'master' ? "Подключен" : "Подключить"}</button>
                </div>
            </section>
            {accept ? <div className={styles.submitProfile}>
                <header className={styles.header}>
                    <Image src={arrow} alt="back" onClick={() => setAccept(false)} />
                    <h4>Адрес приема клиентов</h4>
                    <span style={{opacity: 0}}>Пр</span>
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
                        <input style={{ fontSize: 14 }} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        Номер дома
                        <input style={{ fontSize: 14 }} 
                        type="text" 
                        value={address_full.дом}
                        onChange={(e) => setAddress_full({...address_full,...{'дом':e.target.value}})}  
                        />
                    </label>
                    <label className={styles.radio}>
                        Квартира
                        <input type="radio" name="type_house" value="квартира" 
                        checked={address_full.тип === "квартира" }
                        onChange={(e) => setAddress_full({...address_full,...{'тип':e.target.value}})} 
                        />
                    </label>
                    <label className={styles.radio}>
                        Частный дом
                        <input type="radio" name="type_house" value="частный дом" 
                        checked={address_full.тип === "частный дом" }
                        onChange={(e) => setAddress_full({...address_full,...{'тип':e.target.value}})} 
                        />
                    </label>
                    <label className={styles.radio}>
                        Комерческое помещение
                        <input type="radio" name="type_house" value="комерческое помещение" 
                        checked={address_full.тип === "комерческое помещение" }
                        onChange={(e) => setAddress_full({...address_full,...{'тип':e.target.value}})} 
                        />
                    </label>
                    <label>
                        Этаж
                        <input style={{ fontSize: 14 }} type="text" value={address_full.этаж} 
                        onChange={(e) => setAddress_full({...address_full,...{'этаж':e.target.value}})} 
                        />
                    </label>
                    <label>
                        Номер квартиры
                        <input style={{ fontSize: 14 }} type="text" value={address_full.квартира} 
                        onChange={(e) => setAddress_full(address_full=> ({...address_full,...{'квартира':e.target.value}}))} 
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
                                style={{ background: i.color }}
                            >
                                <span style={{ color: index === 2 ? 'black' : 'white' }} className={i.color === color ? styles.selected_tema : null}>
                                    {i.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                : cur ?
                    <div className={styles.main_tema}>
                        <div className={styles.select_tema}>
                            <h6 onClick={() => setCur(false)}>{currency}</h6>
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
                                    {index === 1 && <span className={styles.img_currency} style={{ fontSize: 20, color: currency === i ? '#fff' : '#000' }}>&#x20BD;</span>}
                                    {index === 2 && <span className={styles.img_currency} style={{ fontSize: 20, color: currency === i ? '#fff' : '#000' }}>&#8376;</span>}

                                </div>
                            )}
                        </div>
                    </div> : null}
        </main>
    )
}