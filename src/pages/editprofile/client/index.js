import styles from '../editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Navi from '@/components/navi'

const filestyle = { borderRadius: '100%' }

const url = 'https://masters-client.onrender.com'

export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const prof = JSON.parse(localStorage.getItem('profile'))
    const dispatch = useDispatch()
    const [name, setName] = useState('Ваше имя')
    const [nikname, setNikname] = useState()
    const [file, setSelectedFile] = useState('/camera_wh.svg')
    const [file_for_upload, set_file_for_upload] = useState()
    const [text, setText] = useState()
    const [message, setMessage] = useState()


    useEffect(() => {        
        setName(prof.name)
        setText(prof.text)        
        setSelectedFile(url + '/var/data/' + prof.nikname + '/main.jpg')
        setNikname(prof.nikname)
    },[])

    function Return() {
        setName(prof.name),
        setText(prof.text),        
        setNikname(prof.nikname),
        setSelectedFile(url + '/var/data/' + prof.nikname + '/main.jpg')
    }
    const EditClient = async () => {
        const data = {
            status: 'client',
            name: name,
            new_nikname: nikname,
            image: '',
            text: text,
            old_nikname: profile.nikname
        }
        if (!file) {
            return setMessage('Необходимо добавить иконку')
        }
        UploadToServer()
        fetch('/api/editprofileclient', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem("profile", JSON.stringify(res))
                dispatch(setprofile(res))
                setMessage('Ваш профиль изменён')
            })
            .catch(err => setMessage("Ошибка сохранения "))
    }

    async function CreateMaster() {
        const data = {
            name: name,
            nikname: nikname,
            image: 'main.jpg',
            text: text,
            color: ['linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)', '#3D4EEA', '#ECEEFD']
        }
        fetch('/api/create_master', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => {
                setMessage('Профиль мастера создан')
            })
            .catch(err => setMessage("Ошибка создания профиля мастера"))
    }

    // const toBase64 = file => new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = error => reject(error);
    // });
    console.log('file', file)
    async function onSelectFile(a) {
        if (a.size > 50000) {
            setMessage('Файл больше 50кб')
        } else {
            // let result = await toBase64(a)
            setSelectedFile(a)
        }

    }
    function SelectUpload(e) {
        let url = URL.createObjectURL(e.target.files[0])
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
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
                <dialog onClick={() => setMessage()} open={message ? 'open' : false} className={message ? styles.active_dialog : styles.passive_dialog}>
                    {message}
                </dialog>
                <span onClick={Return}>Отмена</span>
                <span>{profile.nikname}</span>
                <span onClick={EditClient}>Принять</span>
            </header>
            <div className={styles.image}>
                <div className={styles.profile_image}>
                    <Image
                        src={file}
                        alt="profile"
                        style={file ? filestyle : null}
                        title='заменить изображение'
                        height={file ? 106 : 50}
                        width={file ? 106 : 50}
                    />
                    <form>
                        <input
                            title="Клик для выбора иконки"
                            type="file"
                            name="image"                            
                            onChange={(e)=>SelectUpload(e)}
                            accept=".jpg,.png,.webp"
                        />
                    </form>
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
                </div>
                <label>
                    Имя и фамилия
                    <input style={{ fontSize: 14 }} type="text" value={name} placeholder='Ваше имя' onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Краткая информация
                    <textarea value={text} placeholder='Расскажите о себе' rows={3} onChange={e => setText(e.target.value)} />
                </label>
                <div className={styles.connect_master}>
                    Аккаунт мастера
                    <button onClick={CreateMaster}>{profile.status === 'master' ? "Подключен" : "Подключить"}</button>
                </div>
            </section>
            <Navi />
        </main>
    )
}