import Message from '@/components/message'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'
import { url } from '@/data.'



const active = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500
}
// const services__name = {
//     барбер: 'barber',
//     прически: 'pricheski',
//     массаж: 'massaj',
//     маникюр: 'manikur',
//     педикюр: 'pedikur',
//     окрашивание: 'okrashivanie',
//     чистка: 'chistka',
//     стрижка: 'strijka',
//     брови: 'brovi',
//     ресницы: 'resnici',
//     депиляция: 'depiliaciy',
//     макияж: 'makiaj'
// }
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

export default function AddList() {
    const my_ref = useRef(null)
    const [lists, setlists] = useState([])
    const [select, setselect] = useState(true)
    const [nikname, setnikname] = useState()
    const [color, setColor] = useState([])
    const [services, setServices] = useState()
    const [tag, settag] = useState()
    const [activeImage, setActiveImage] = useState()
    const [message, setmessage] = useState('')

    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...prof.color])
        setServices(prof.services)
        fetch(`/api/get_images?nikname=${prof.nikname}`)
            .then(res => res.json())
            .then(res => setlists(res))
    }, [])
    // function Deletefile(a) {
    //     fetch(`/api/delete_images?id=${a}`)
    //     .then(res => res.json())
    //     .then(res => setlists(res))
    //     fetch(`${url}/deletelist?name=${nikname}&list=${a}`)
    //         .then(res => Del_file(a))
    //         .catch(err => console.log(err))
    // }
    // function Del_file(a) {
    //     let new_list = lists.filter(i => i.id !== a)
    //     setlists(new_list)
    // }

    function SetForTag(e) {
        e.stopPropagation()
        setActiveImage(e.target.id)
        let text = lists.filter(i=>i.id === +e.target.id)[0]['review']
        console.log(text)
        my_ref.current.value = text ? text :'Добавить комментарий'
    }




    function SaveTag() {
        fetch('/api/add_review_publication', {
            body: JSON.stringify({
                id: activeImage,
                review: my_ref.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
            .then(res => {
                setmessage('Коментарий сохранён')
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }

    async function selectUpload(e) {
        // e.preventDefault()
        if(!e.target.files[0]) return 
        const prof = JSON.parse(localStorage.getItem('profile'))
        let id = await fetch('/api/add_image', {
           
            body: JSON.stringify({
                nikname: prof.nikname,
                service: services__name[tag],
                city: prof.city,
                master_name: prof.name
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
            .then(res => res.json())
            .then(res => res[0].id)
        console.log(id)


        // // let new_list = lists.filter(i => tag ? i.service === services__name[tag] !== -1 : i)
        let data = new FormData()
        let file_name = id + '.jpg'
       
        data.append('file', e.target.files[0], file_name)
        fetch(`${url}/upl?name=${nikname}`, {
            body: data,
            method: 'post',
        })
            .then(res => {
                setlists(lists => [...lists, { 'id': id, 'service': services__name[tag], 'nikname': nikname }])
                setmessage('Публикация отправлена на модерацию')
                setTimeout(() => setmessage(''), 2000)
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
                setTimeout(() => setmessage(''), 2000)
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
                <label title={tag ? 'Добавить публикацию' : ' Необходимо выбрать услугу'} className={styles.sertificat__upload} style={{ color: color[1], backgroundColor: color[2] }}>
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
                {lists?.filter(i => tag ? i.service === services__name[tag] !== -1 : i).map(i =>
                    <div
                        key={i.id}
                        id={i.id}
                        onClick={SetForTag} title="добавить комментарий"
                        className={styles.sertificats}
                        style={{ border: i.id === +activeImage ? "2px solid " + color[1] : '', backgroundImage: "url(" + url + "/var/data/" + nikname + '/' + i.id + '.jpg' }}
                    />


                )}

            </form>
            <section className={styles.services}>
                {services?.map(i =>
                    <span
                        key={i}
                        className={tag === i ? styles.active__service : null}
                        onClick={() => {
                            settag(i)
                            setActiveImage(i)
                        }}
                    >
                        {i}
                    </span>
                )}
            </section>
            {activeImage ?
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
                </label> : null
            }
        </main>
    )
}