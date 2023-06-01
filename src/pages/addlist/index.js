import Message from '@/components/message'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'

const url = 'https://masters-client.onrender.com'
const url_loc = 'http://localhost:5000'

const active = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500
}
const services__name = {
    барбер: 'barber',
    прически: 'pricheski',
    массаж: 'massaj',
    маникюр: 'manikur',
    педикюр: 'pedikur',
    окрашивание: 'okrashivanie',
    чистка: 'chistka',
    стрижка: 'strijka',
    брови: 'brovi',
    ресницы: 'resnici',
    депиляция: 'depiliaciy',
    макияж: 'makiaj'
}
const url_two = 'https://masters-client.onrender.com/'
export default function AddList() {
    const my_ref = useRef(null)
    const [lists, setlists] = useState([])
    const [select, setselect] = useState(true)
    const [nikname, setnikname] = useState()
    const [color, setColor] = useState([])
    const [services, setservices] = useState()
    const [tag, settag] = useState()
    const [activeImage, setActiveImage] = useState()
    const [message, setmessage] = useState('')

    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...prof.color])
        setservices(prof.services)
        fetch(`${url}/getlists?dir=${prof.nikname}`)
            .then(res => res.json())
            .then(res => setlists(res))
    }, [])
    function Deletefile(a) {
        fetch(`${url}/deletelist?name=${nikname}&list=${a}`)
            .then(res => Del_file(a))
            .catch(err => console.log(err))
    }
    function Del_file(a) {
        let new_list = lists.filter(i => i !== a)
        setlists(new_list)
    }

    function SetForTag(e) { 
        e.stopPropagation()     
        setActiveImage(e.target.id)              
        let new_file = nikname + '/' + e.target.id       
        fetch(`${url_two}readtext?file=${new_file}`)
        .then(res => res.text())
        .then(res=> {
           
            my_ref.current.value = res
        })
    }
    const date = new Date();

    const options = {     
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    
    let current_date = date.toLocaleString('ru-RU', options)
    function SaveTag() {       
        fetch(`${url}/createtag?name=${nikname}`, {
            body: JSON.stringify({
                name: activeImage,
                text: current_date + '\n'+ my_ref.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
        .then(res => {
            setmessage('Коментарий сохранён')
            setTimeout(()=>setmessage(''),2000)
        })
        .catch(err => console.log(err))
    }

    function selectUpload(e) {
        e.preventDefault()
        let new_list = lists.filter(i => tag ? i.search(services__name[tag]) !== -1 : i)
        let data = new FormData()
        let file_name = 'list' + '__' + services__name[tag] + "__" + new_list.length + '.jpg'
        data.append('file', e.target.files[0], file_name)
        fetch(`${url}/upl?name=${nikname}`, {
            body: data,
            method: 'post',
        })
        .then(res => {
            setlists(lists => [...lists, file_name])
            setmessage('Публикация отправлена на модерацию')
            setTimeout(()=>setmessage(''),2000)
        })
        .catch(err => console.log(err))
    }
    function ReplaceImage(e, a) {
        e.stopPropagation()
        console.log('replace') 
        e.preventDefault()
        let data = new FormData()
        data.append('file', e.target.files[0], a)       
        fetch(`${url}/upl?name=${nikname}`, {
            body: data,
            method: 'post',
        })
        .then(res => {
            setmessage('Изображение заменено')
            setTimeout(()=>setmessage(''),2000)
        })
        .catch(err => console.log(err))
    }
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Menu_icon color={color[1]} type="arrow" />
                <span >Добавить публикацию</span>
                <span style={{ color: color[1] }}></span>
            </header>
            <Message text="Вы можете опубликовать работу или создать пост о 
                поиске моделей, который будет отображаться в 
                соответсвующем меню на сервисе."
                color={color}
            />
            <div className={styles.selector} onClick={() => setselect(!select)}>
                <span style={select ? { ...active, backgroundColor: color[1] } : null}>Выполненная работа</span>
                <span style={select ? null : { ...active, backgroundColor: color[1] }}>Поиск моделей</span>
            </div>
            <dialog open={message} className={styles.message}>
                {message}
            </dialog>
            <form className={styles.main__form}>
                <label  title={tag ?'Добавить публикацию':' Необходимо выбрать услугу'} className={styles.sertificat__upload} style={{ color: color[1], backgroundColor: color[2] }}>
                    +
                    <input
                        type="file"
                        name="image"
                       
                        disabled={!tag}
                        style={{ display: 'none' }}
                        accept=".jpg"
                        onChange={(e) => selectUpload(e)}
                    />
                </label>
                {lists?.filter(i => tag ? i.search(services__name[tag]) !== -1 : i).map((i, index) =>
                    <div
                        key={i}                       
                        className={styles.sertificats}
                        style={{ border: i === activeImage ? "2px solid" + color[1] : '', backgroundImage: "url(" + url + "/var/data/" + nikname + '/' + i }}
                    >
                        {lists.length != index + 1 ? 
                        <span id={i} onClick={SetForTag}>
                            <label className={styles.sertificat__replace} >                            
                                <img src='/edit_wh.svg' height={24} width={24} alt="trash" title='заменить'/>                                
                                <input
                                    type="file"
                                    name="image"
                                    disabled={!tag}
                                    style={{ display: 'none' }}
                                    accept=".jpg"
                                    onChange={(e) => ReplaceImage(e, i)}
                                />
                            </label>
                        </span>:null}
                        {lists.length === index + 1 ? 
                        <span id={i} style={{ color: color[1] }} onClick={SetForTag}>
                            <img src='/trash_del.svg' title='удалить' height={24} width={24} alt="trash" onClick={() => Deletefile(i)}/>
                        </span> : null}
                    </div>
                )}

            </form>
            <section className={styles.services}>
                {services?.map(i =>
                    <span 
                        key={i} 
                        className={tag === i ? styles.active__service : null} 
                        onClick={() => {
                            settag(i)
                            setActiveImage()
                        }}
                    >
                        {i}
                    </span>
                )}
            </section>
            {activeImage ?
                <>
                    <label className={styles.addtag}>
                    Расскажите о проекте подробнее...  
                        <textarea
                            ref={my_ref}                           
                            maxLength="500"
                            placeholder='Ваш комментарий'
                            rows={10}
                            style={{ borderColor: color[1] }}
                        />
                        <button onClick={SaveTag} style={{ ...active, backgroundColor: color[1] }}>Сохранить</button>
                    </label>
                </> : null}
        </main>
    )
}