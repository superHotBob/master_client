import Message from '@/components/message'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'
import { my_tema } from '@/data.'


const active = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500
}

const services__name = {
    барбер: 'барбер',
    прически: 'прически',
    массаж: 'массаж',
    маникюр: 'маникюр',
    педикюр: 'педикюр',
    окрашивание: 'окрашивание',
    чистка: 'чистка',
    стрижка: 'стрижка',
    брови: 'брови',
    ресницы: 'ресницы',
    депиляция: 'депиляция',
    макияж: 'макияж'
}


import Event from '@/components/event'

export default function AddList() {

    const my_ref = useRef(null)   
    const [nikname, setnikname] = useState()
    const [color, setColor] = useState([])
    const [services, setServices] = useState()
    const [tag, settag] = useState()  
    const [message, setmessage] = useState('')
    const [selector, setSelector] = useState(true)
    const [file_for_upload, set_file_for_upload] = useState()  
    const [file, setSelectedFile] = useState('')   


    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...my_tema[prof.tema].color])
        setServices(prof.services)
        settag(prof.services[0])       
    }, [])

   

    function SelectUpload(e) {      
        let url = URL.createObjectURL(e.target.files[0])       
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
    }


   


    async function Upload() {  
        
        if(file_for_upload.size > 1000000) {           
            setmessage('Размер изображения больше 1 мб')
            setInterval(()=>setmessage(''),2000)
            setSelectedFile('')
            return ;
        }           
        if (!file_for_upload) return
        const prof = JSON.parse(localStorage.getItem('profile'))
        let id = await fetch('/api/add_image', {
            method: 'POST',
            body: JSON.stringify({
                nikname: prof.nikname,
                service: services__name[tag] ? services__name[tag] : 'all',
                city: prof.city,
                master_name: prof.name,
                review: my_ref.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(res => res)       
        let data = new FormData()
        const type = file_for_upload.name.split('.')[1]
        data.append('file', file_for_upload, `${id}.${type}`) 
        data.append('name', id) 
        // fetch('http://localhost:5000/upload', {
        //     method: 'POST',
        //     body: data,
        // })
        // .then(res => res.text())
        // .then(res=>setSelectedFile(''))                 
        // .catch(err => console.log(err))      
        fetch('/api/add_image_to_server', {
            method: 'POST',
            body: data,
        })
        .then(res => res.text())
        .then(res=>setSelectedFile(''))                 
        .catch(err => console.log(err))
    }
  

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Menu_icon color={color[1]} type="arrow" />
                <span >Добавить публикацию</span>
                <img onClick={Upload} src='/upload.svg' height={20} width={18} alt='upload' />
            </header>
            <Message text="Вы можете опубликовать работу или создать пост о 
                поиске моделей, который будет отображаться в 
                соответсвующем меню на сервисе."
                color={color}
            />
            <div className={styles.selector}>
                <span onClick={() => setSelector(true)} style={selector ? { ...active, backgroundColor: color[1] } : null}>
                    Выполненная работа
                </span>
                <span onClick={() => setSelector(false)} style={selector ? null : { ...active, backgroundColor: color[1] }}>
                    Поиск моделей
                </span>
            </div>
            <dialog open={message} className={styles.message}>
                {message}
            </dialog>
            {selector ? <>
                <form className={styles.main__form}>
                    {file ? <img src={file} alt="image" />:
                    <label title={tag ? 'Добавить публикацию' : ' Необходимо выбрать услугу'} className={styles.sertificat__upload} style={{ color: color[1], backgroundColor: color[2] }}>
                        +
                        <input
                            type="file"
                            name="image"
                            style={{ display: 'none' }}
                            accept=".jpg,.png"
                            onChange={(e) => SelectUpload(e)}
                        />
                    </label>}
                    {/* {images?.filter(i => i.service === tag.toLowerCase()).map(i =>
                        <div
                            key={i.id}                                                    
                            className={styles.sertificats}
                            style={{ backgroundImage: "url(https://masters.place/images/" + i.id + '.jpg' }}
                        >
                            <span  
                                id={i.id}   
                                onClick={SetForTag} title="Добавить комментарий"
                                style={{ opacity: i.id === +activeImage ? 0.5 : 1 }}
                            >
                                <img
                                    src='/trash.svg'
                                    height={24}
                                    title="удалить изображение"
                                    width={24}
                                    id={i.id}
                                    alt="trash"
                                    onClick={deleteImage}
                                />
                            </span>
                        </div>
                    )} */}
                </form>
                <section className={styles.services}>
                    {services?.map(i =>
                        <span
                            key={i}
                            className={tag === i ? styles.active__service : null}
                            style={{backgroundColor: tag === i ? color[1] : null }}
                            onClick={() => settag(i)}
                        >
                            {i}
                        </span>
                    )}
                </section>
                <label className={styles.addtag}>
                   Раскажите о работе подробнее ....
                    <textarea
                        ref={my_ref}
                        maxLength="500"
                        placeholder='Ваш комментарий'
                        rows={10}
                        style={{ borderColor: color[1] }}
                    />                  
                </label> 

            </>
                :
                <Event nikname={nikname} color={color} sel={selector} />
            }
        </main>
    )
}