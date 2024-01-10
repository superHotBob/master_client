import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setlocation, setnikname, setprofile , setstate} from '@/reduser'
import Image from 'next/image'
import { useEffect, useState } from 'react'


import { useRouter } from 'next/router'


import Link from 'next/link'

import { my_tema } from '@/data.'



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

export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const location = useSelector(state => state.counter.location)
    const router = useRouter()

    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [nikname, setNikname] = useState()
    const [text, setText] = useState()
    const [file, setSelectedFile] = useState()
    const [file_for_upload, set_file_for_upload] = useState(null)

    const [message, setMessage] = useState()
   
    const [tema, viewTemaBlock] = useState(false)
    const [cur, setCur] = useState(false)
    const [color, setColor] = useState(my_tema[0].color)
    const [currency, setCurrency] = useState('BYN')
    const [city, setCity] = useState('')
    const [state, setMyState] = useState('')
    const [address, setAddress] = useState()
    const [street, setstreet] = useState()
    const [address_full, setAddress_full] = useState({})
   
    



    
    useEffect(() => {
        let {currency, name, text, city, address, nikname, address_full,state , tema, locations} = JSON.parse(localStorage.getItem('profile'))
        dispatch(setlocation(locations))
        dispatch(setnikname(nikname))
        if(state) {
            
            dispatch(setstate(state))
        }    
        if (!nikname) {
            return () => router.push('/enter')
        } else {
            setName(name),
            setText(text),
            setCity(city ? city : 'минск'),
            setCurrency(my_currency[current_symbol.indexOf(currency)] || 'Белорусский рубль'),
            setAddress(address)
            setSelectedFile(process.env.url_image + nikname + '.jpg')
            setAddress_full(address_full)
            setNikname(nikname)
            setMyState(state)
            setstreet(address?.split(',').length === 3 ? address?.split(',')[1] : address?.split(',')[2])
            setColor(tema ? my_tema[+tema].color : my_tema[0].color)
        }

    }, [])
    function Return() {
        let pro = JSON.parse(localStorage.getItem('profile'))
        setName(pro.name),
        setText(pro.text),
        setCurrency('Белорусский рубль')
        setSelectedFile(process.env.url_image + pro.nikname + '.jpg')
        setAddress(pro.address),
        setNikname(pro.nikname),
        setColor(my_tema[+pro.tema].color)
        router.push(`/${pro.nikname}`)
    }
    const editMaster = async () => {
        const data = {
            status: 'master',
            name: name,
            text: text,
            state: state,
            nikname: nikname,
            currency: current_symbol[my_currency.indexOf(currency)],
            city: city ? city.toLowerCase() : 'минск',
            tema: my_tema.map(i => i.color).indexOf(color),
        }
        const response = await fetch('/api/edit_profile_master', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (file_for_upload) { uploadToServer() }
        const result = await response.json()
        localStorage.setItem("profile", JSON.stringify(result));
        dispatch(setprofile(result))
        router.push(`/masterprofile/${nikname}`)
    }

    function selectUpload(e) {
        if (e.target.files[0].size > 5000000) {
            setMessage('Размер изображения больше 5 мб')
            return;
        }
        let url = URL.createObjectURL(e.target.files[0])
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
    }
   
    function PoliticReplace(a) {
        fetch(`/api/update_confid?confid=${a}&nikname=${profile.nikname}`)
            .then(res => res.json())
            .then(res => {
                let pro = JSON.parse(localStorage.getItem('profile'))
                pro['confid'] = a
                localStorage.setItem("profile", JSON.stringify(pro))
                dispatch(setprofile(pro))
            })
    }
    const uploadToServer = () => {
        let data = new FormData()
        const type = file_for_upload.name.split('.')[1]
        data.append('file', file_for_upload, `${profile.nikname}.${type}`)
        data.append('name', profile.nikname)
        fetch('/api/replace_icon', {
            method: 'POST',
            body: data,
        })
            .then(res => res.text())
            .then(res => console.log(res))
        setSelectedFile(process.env.url_image + profile.nikname + '.jpg')
    }
    return (
        <>
            <header className={styles.header}>
                <button onClick={Return} style={{ color: color[1] }}>Отмена</button>
                <span>{nikname}</span>
                <button onClick={editMaster} style={{ color: color[1] }}>Принять</button>
            </header>
            <div className={styles.image} style={{ background: color[0] }}>
                <span onClick={() => viewTemaBlock(true)}>Изменить обложку</span>
                <form className={styles.profile_image}>
                    <Image
                        src={file ? file : process.env.url_image + profile.nikname + '.jpg'}
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
                        onChange={selectUpload}
                        accept="image/*"
                    />
                </form>

            </div>
            <p className={styles.name}>{profile.name || name || 'Ваше имя'}</p>
            <section className={styles.inputs}>
                <p>
                    <span>Публичная ссылка, никнейм</span>
                    <Link className={styles.change} href="/editnikname">Изменить</Link>
                </p>
                <div className={styles.nikname}>
                    <span>masters.place/</span>
                    <b>{nikname}</b>
                </div>
                <label>
                    Имя и фамилия
                    <input style={{ fontSize: 14 }} type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                <p>
                    <span>Место приема клиентов</span>
                    <Link href="/editprofile/address" className={styles.change} >Изменить</Link>
                </p>
                <div className={styles.address}>
                    <span>{address}</span>
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
                {profile.confid ?
                    <div className={styles.confid_politic_false} onClick={() => PoliticReplace(false)} />
                    :
                    <div className={styles.confid_politic_true} onClick={() => PoliticReplace(true)} />
                }
                <div className={styles.connect_master} />
            </section>
           
            {tema ?
                <div className={styles.main_tema}>
                    <div className={styles.select_tema}>
                        <h6 onClick={() => viewTemaBlock(false)}>Выбор темы</h6>
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
                                    {index === 0 && <span className={styles.img_currency} style={{ color: currency === i ? '#fff' : '#000' }}>BYN</span>}
                                    {index === 1 && <span className={styles.img_currency} style={{ color: currency === i ? '#fff' : '#000' }}>₽</span>}
                                    {index === 2 && <span className={styles.img_currency} style={{ color: currency === i ? '#fff' : '#000' }}>₸</span>}
                                </div>
                            )}
                        </div>
                    </div> : null}

        </>
    )
}