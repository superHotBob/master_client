import styles from '../editprofile.module.css'
import { useDispatch } from 'react-redux'
import { setprofile } from '@/reduser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'





export default function EditProfile() {   
    const router = useRouter()
    const dispatch = useDispatch()
    const [my_profile, setmy_profile] = useState({})    
    const [file, setSelectedFile] = useState('')
    const [file_for_upload, set_file_for_upload] = useState()    
    const [message, setMessage] = useState()

    const { nikname, name, text } = my_profile

    

    
    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))        
        setmy_profile(prof)  
        dispatch(setprofile(prof))         
        setSelectedFile(process.env.url_image + prof.nikname + '.jpg')
            
    }, [dispatch])   
    function Return() {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setmy_profile(prof) 
        setSelectedFile(process.env.url_image + nikname + '.jpg')  
        router.back()
    }
    const EditClient = async () => {
        const data = {            
            name: name,
            nikname: nikname,            
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
            router.push(`/clientprofile/${nikname}`)
        })
        .catch(err => setMessage("Ошибка сохранения "))
    }

    async function CreateNewMaster() {
        const data = {
            name: name,
            nikname: nikname,           
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
        fetch(`/api/update_confid?confid=${a}&nikname=${nikname}`)
        .then(res=>res.json())
        .then(res=> {
            localStorage.setItem("profile", JSON.stringify(res))
            dispatch(setprofile(res))
        })
    }
    const UploadToServer = () => {        
        let data = new FormData()
        const type = file_for_upload.name.split('.')[1]
        data.append('file', file_for_upload, `${nikname}.${type}`) 
        data.append('name', nikname)           
        fetch('/api/replace_icon', {
            method: 'POST',
            body: data,
        })
        .then(res => res.text())
        .then(res=>console.log(res))       
        setSelectedFile(process.env.url_image + nikname + '.' + type)
    }

    return (
        <>
            <header className={styles.header}>                
                <button onClick={Return}>Отмена</button>
                {nikname}
                <button onClick={EditClient}>Принять</button>
            </header>
            <form style={{ height: '106px' }} className={styles.image}>
                <Image
                    src={file}
                    alt="фото клиента"
                    title='Заменить иконку профиля'
                    priority={true}
                    height={file ? 106 : 50}
                    width={file ? 106 : 50}
                />
                <input
                    title="Заменить иконку профиля"
                    type="file"
                    name="image"
                    onChange={SelectUpload}
                    accept="image/png, image/jpeg" 
                />
            </form>
            <p className={styles.name}>{name}</p>
            <section className={styles.inputs}>             
                <label>
                    Имя и фамилия
                    <input 
                        style={{ fontSize: 14 }} 
                        type="text" 
                        value={name} 
                        placeholder='Ваше имя'
                        onChange={(e) => setmy_profile(my_profile=>({...my_profile,...{'name':e.target.value}}))} 
                    />
                </label>
                <label>
                    Краткая информация
                    <textarea 
                        value={text} 
                        placeholder='Расскажите о себе' 
                        rows={3} 
                        onChange={e => setmy_profile(my_profile=>({...my_profile,...{'text': e.target.value}}))} 
                    />
                </label>
                <div className={styles.create_master} onClick={CreateNewMaster}/>
                { my_profile.confid ? 
                    <div className={styles.confid_politic_false} onClick={()=>PoliticReplace(false)}/>
                    :    
                    <div className={styles.confid_politic_true} onClick={()=>PoliticReplace(true)}/>
                }        
                   
                
            </section>
           
        </>
    )
}