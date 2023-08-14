import styles from '../editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Navi from '@/components/navi'




export default function EditProfile() {
    const profile = useSelector(state => state.counter.profile)
    const router = useRouter()
    const dispatch = useDispatch()
    const [my_profile, setmy_profile] = useState({})    
    const [file, setSelectedFile] = useState('')
    const [file_for_upload, set_file_for_upload] = useState()    
    const [message, setMessage] = useState()

    
    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))        
        setmy_profile(my_profile=>(
            {...my_profile,...prof}
        ))        
        setSelectedFile(process.env.url + 'var/data/' + prof.nikname + '/main.jpg')       
    }, [])   
    function Return() {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setmy_profile(my_profile=>(
            {...my_profile,...prof}
        )) 
        setSelectedFile(process.env.url + 'var/data/' + prof.nikname + '/main.jpg')
        router.back()
    }
    const EditClient = async () => {
        const data = {            
            name: my_profile.name,
            nikname: my_profile.nikname,            
            text: my_profile.text,           
        }       
        if (file_for_upload) { UploadToServer() }
        fetch('/api/edit_profile_client', {
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

    async function CreateNewMaster() {
        const data = {
            name: my_profile,
            nikname: my_profile.nikname,
            image: '',
            text: my_profile.text,
            color: ''
        }
        fetch('/api/create_master', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        .then(res => res.json())
        .then(res => {
            // setMessage('Профиль мастера создан')
            localStorage.setItem('profile', JSON.stringify(res[0]))
            router.push('/editprofile')

        })
        .catch(err => setMessage("Ошибка создания профиля мастера"))
    }
   
    function SelectUpload(e) {
        let url = URL.createObjectURL(e.target.files[0])
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
    }

    function UploadToServer() {
        let data = new FormData()       
        data.append('file', file_for_upload, 'main.jpg')
        fetch(`${url}/upl?name=${my_profile.nikname}`, {
            body: data,
            method: 'post',
        }).then(res => console.log('file is good'))
        setSelectedFile(process.env.url + 'var/data/' + profile.nikname + '/main.jpg')      
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <dialog 
                    onClick={() => setMessage()} 
                    open={message ? 'open' : false} 
                    className={message ? styles.active_dialog : styles.passive_dialog}
                >
                    <p>{message}</p>
                </dialog>
                <span onClick={Return}>Отмена</span>
                <span>{profile.nikname}</span>
                <span onClick={EditClient}>Принять</span>
            </header>
            <form style={{ height: '106px' }} className={styles.image}>
                <Image
                    src={file ? file : process.env.url + '/var/data/' + profile.nikname + '/main.jpg'}
                    alt="фото"
                    title='заменить изображение'
                    height={file ? 106 : 50}
                    width={file ? 106 : 50}
                />
                <input
                    title="Клик для выбора иконки"
                    type="file"
                    name="image"
                    onChange={(e) => SelectUpload(e)}
                    accept=".jpg"
                />
            </form>
            <p className={styles.name}>{my_profile.name || 'Ваше имя'}</p>
            <section className={styles.inputs}>             
                <label>
                    Имя и фамилия
                    <input 
                        style={{ fontSize: 14 }} 
                        type="text" 
                        value={my_profile.name} 
                        placeholder='Ваше имя'
                        onChange={(e) => setmy_profile(my_profile=>({...my_profile,...{'name':e.target.value}}))} 
                    />
                </label>
                <label>
                    Краткая информация
                    <textarea 
                    value={my_profile.text} 
                    placeholder='Расскажите о себе' 
                    rows={3} 
                    onChange={e => setmy_profile(my_profile=>({...my_profile,...{'text': e.target.value}}))} />
                </label>
                <div className={styles.connect_master_connect} onClick={CreateNewMaster}/>            
                   
                
            </section>
            <Navi />
        </main>
    )
}