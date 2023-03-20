import Header from '@/components/header'
import styles from './editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import arrow from '../../../public/arrow_back.svg'

const filestyle= {
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
    useEffect(() =>(
     setName(profile.name),
     setText(profile.text),
     setSelectedFile(profile.image),
     setNikname(profile.nikname) 
    ),[])





    const handleSubmit = async () => {

        const data = { name: name, new_nikname: nikname, image: file, text: text, old_nikname: profile.nikname }

        const response = await fetch('/api/editprofile', {

            body: JSON.stringify(data),

            headers: {
                'Content-Type': 'application/json',
            },
            // The method is POST because we are sending data.
            method: 'POST',
        })

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        console.log(result)
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
        if(a.size > 50000) {
            console.log("Size is big")
        } else {
            let result = await toBase64(a)
            setSelectedFile(result)
        }
      
    }
    return (
        <main className={styles.main}>
            <Header sel={"/client/" + profile.nikname} text={profile.nikname} />
            <div className={styles.image}>
                <div className={styles.profile_image}>
                    <Image
                        src={file ? file : '/camera_wh.svg'}
                        alt="profile"
                        style={file ? filestyle: null }
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
                    <span onClick={()=>setAccept(true)}>изменить</span>
                </h6>
                <div className={styles.nikname}>
                    <span>masters.place/client/</span><span>{nikname||profile.nikname}</span>
                </div>
                <label>
                    Имя и фамилия
                    <input type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Краткая информация
                    <textarea value={text} placeholder='Расскажите о себе' rows={3} onChange={e => setText(e.target.value)} />
                </label>
                <div className={styles.connect_master}>
                    Аккаунт мастера
                    <button>Подключить</button>
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
                <input type="text" value={nikname} onChange={e=>setNikname(e.target.value)} />
                <p style={{ color: '#3D4EEA' }}>Скопировать ссылку</p>

            </div> : null}
        </main>
    )
}