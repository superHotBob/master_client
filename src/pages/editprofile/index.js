import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import arrow from '../../../public/arrow_back.svg'

const filestyle = {
    borderRadius: '100%'
}

export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const dispatch = useDispatch()
    const [name, setName] = useState('Ваше имя')
    const [nikname, setNikname] = useState()
    const [file, setSelectedFile] = useState()
    const [text, setText] = useState()
    const [accept, setAccept] = useState(false)

    useEffect(() => (
        setName(profile.name),
        setText(profile.text),
        setSelectedFile(profile.image),
        setNikname(profile.nikname)
    ), [])

    function Return() {
        setName(profile.name),
            setText(profile.text),
            setSelectedFile(profile.image),
            setNikname(profile.nikname)
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
            currency: profile.currency
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
            <div className={styles.image}>
                <div className={styles.profile_image}>
                    <Image
                        src={file ? file : '/camera_wh.svg'}
                        alt="profile"
                        style={file ? filestyle : null}
                        title='заменить изображение'
                        height={file ? 106 : 50}
                        width={file ? 106 : 50}
                    />
                    <input type="file" onChange={(e) => onSelectFile(e.target.files[0])} accept=".jpg" />
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
                    <input style={{fontSize: 14}} type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                {profile.status === 'master' ?
                    <>
                        <h6>
                            <span>Место приема клиентов</span>
                            <span className={styles.change} onClick={() => setAccept()}>изменить</span>
                        </h6>
                        <div className={styles.address}>
                            <span>{profile.address}</span>
                        </div></> : null}
                <label>
                    Краткая информация
                    <textarea value={text} placeholder='Расскажите о себе' rows={3} onChange={e => setText(e.target.value)} />
                </label>
                {profile.status === 'master' ? <>
                    <div className={styles.currency}>
                        Основная валюта
                        <button>Российский рубль ₽</button>
                    </div>
                    <div className={styles.tema}>
                        Тема профиля
                        <button>Изменить</button>
                    </div></> : null}
                <div className={styles.connect_master}>
                    Аккаунт мастера
                    <button>{profile.status === 'master' ? "Подключен" : "Подключить"}</button>
                </div>
            </section>
            {accept ? <div className={styles.submitProfile}>
                <header className={styles.header}>
                    <Image src={arrow} alt="back" onClick={() => setAccept(false)} />
                    <span>Короткое имя</span>
                    <span onClick={handleSubmit}>Принять</span>
                </header>
                <p>
                    Вы можете указать своё короткое имя, чтобы другим<br />
                    людям было проще вас найти или упомянуть в своих запясях.<br />
                    Ваше короткое имя: <span style={{ color: '#3D4EEA' }}>@{nikname}</span>
                </p>
                <p>
                    Ваша ссылка MasterPlace:
                    <span style={{ color: '#3D4EEA' }}>master.palce/client/{nikname}</span>
                </p>
                <input type="text" value={nikname} onChange={e => setNikname(e.target.value)} />
                <p style={{ color: '#3D4EEA' }}>Скопировать ссылку</p>

            </div> : null}
        </main>
    )
}