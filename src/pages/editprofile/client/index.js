import styles from '../editprofile.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'





export default function EditProfile() {
    const profile =  useSelector(state => state.counter.profile)
    const router = useRouter()
    const dispatch = useDispatch()
    const [my_profile, setmy_profile] = useState({})    
    const [file, setSelectedFile] = useState('')
    const [file_for_upload, set_file_for_upload] = useState()    
    const [message, setMessage] = useState()

    
    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))        
        setmy_profile(prof)           
        setSelectedFile(process.env.url_image + prof.nikname + '.jpg')
            
    }, [])   
    function Return() {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setmy_profile(prof) 
        setSelectedFile(process.env.url_image + my_profile.nikname + '.jpg')  
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
            router.push(`/clientprofile/${my_profile.nikname}`)
        })
        .catch(err => setMessage("Ошибка сохранения "))
    }

    async function CreateNewMaster() {
        const data = {
            name: my_profile.name,
            nikname: my_profile.nikname,           
            text: my_profile.text           
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
    function PoliticReplace(a) {
        fetch(`/api/update_confid?confid=${a}&nikname=${my_profile.nikname}`)
        .then(res=>res.json())
        .then(res=> {
            localStorage.setItem("profile", JSON.stringify(res))
            dispatch(setprofile(res))
        })
    }
    const UploadToServer = () => {        
        let formData = new FormData()
        const type = file_for_upload.name.split('.')[1]
        formData.append('file', file_for_upload, `${my_profile.nikname}.${type}`) 
        formData.append('name', my_profile.nikname)           
        fetch('/api/replace_icon', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.text())
        .then(res=>console.log(res))       
        setSelectedFile(process.env.url_image + my_profile.nikname + '.' + type)
    }

    return (
        <>
            <header className={styles.header}>
                <dialog 
                    onClick={() => setMessage()} 
                    open={message ? 'open' : false} 
                    className={message ? styles.active_dialog : styles.passive_dialog}
                >
                    <p>{message}</p>
                </dialog>
                <span onClick={Return}>Отмена</span>
                <span>{my_profile.nikname}</span>
                <button onClick={EditClient}>Принять</button>
            </header>
            <form style={{ height: '106px' }} className={styles.image}>
                <Image
                    src={file ? file : process.env.url_image + my_profile.nikname + '.jpg'}
                    alt="фото клиента"
                    title='заменить изображение'
                    priority={true}
                    height={file ? 106 : 50}
                    width={file ? 106 : 50}
                />
                <input
                    title="Клик для выбора иконки"
                    type="file"
                    name="image"
                    onChange={SelectUpload}
                    accept="image/png, image/jpeg" 
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
                <div className={styles.create_master} onClick={CreateNewMaster}/>
                { profile.confid ? 
                    <div className={styles.confid_politic_false} onClick={()=>PoliticReplace(false)}/>
                    :    
                    <div className={styles.confid_politic_true} onClick={()=>PoliticReplace(true)}/>
                }        
                   
                
            </section>
           
        </>
    )
}