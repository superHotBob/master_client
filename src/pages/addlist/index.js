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
    const [selector, setSelector] = useState(true)
    const [file_for_upload, set_file_for_upload] = useState()  
    const [file, setSelectedFile] = useState('')   


    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...my_tema[prof.tema].color])
        setServices(prof.services)
        
        settag(prof.services != undefined ? prof.services[0] : [])       
    }, [])

   

    function SelectUpload(e) {      
        let url = URL.createObjectURL(e.target.files[0])       
        setSelectedFile(url)
        set_file_for_upload(e.target.files[0])
    }


   


    async function Upload() {        
        if (!file_for_upload) return
        const prof = JSON.parse(localStorage.getItem('profile'))
        let res = await fetch('/api/add_image_to_base', {
            method: 'POST',
            body: JSON.stringify({
                nikname: prof.nikname,
                service: services__name[tag] ? services__name[tag] : 'all',
                city: prof.state,
                master_name: prof.name,
                review: my_ref.current.value
            }),
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(res => res)       
        let data = new FormData()
        const type = file_for_upload.name.split('.')[1]
        data.append('file', file_for_upload, `${res.id}.${type}`) 
        data.append('name', res.id) 
        fetch('https://admin.masters.place/upload', {
            method: 'POST',
            body: data,
        })
        .then(res => res.text())
        .then(res=>setSelectedFile(''))                 
        .catch(err => console.log(err))       
    }
    
  

    return (
        <>
            <header className={styles.header}>
                <Menu_icon color={color[1]} type="arrow" />
                <span >Добавить публикацию</span>
                <img onClick={Upload} src='/upload.svg' height={30} width={30} alt='upload' title='опубликовать' />
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
                        rows={5}
                        style={{ borderColor: color[1] }}
                    />                  
                </label> 
                <button disabled={!file} className={styles.buttonupload} onClick={Upload}>Опубликовать</button>

            </>
                :
                <Event nikname={nikname} color={color} sel={selector} />
            }
        </>
    )
}