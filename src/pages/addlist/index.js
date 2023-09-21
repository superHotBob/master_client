import Message from '@/components/message'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'
import { my_tema } from '@/data.'
import useSWR, { useSWRConfig } from 'swr'

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
    const [activeImage, setActiveImage] = useState(null)
    const [message, setmessage] = useState('')
    const [selector, setSelector] = useState(true)


    const { data: images } = useSWR(`/api/get_images?nikname=${nikname}`)
    const { mutate } = useSWRConfig()


    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...my_tema[prof.tema].color])
        setServices(prof.services)
        settag(prof.services[0])
        // fetch(`/api/get_images?nikname=${prof.nikname}`)
        // .then(res => res.json())
        // .then(res => setlists(res))
    }, [])

    function SetForTag(e) {
        setActiveImage(e.target.id)
        let text = images.filter(i => i.id === +e.target.id)[0]['review']
        if(activeImage) {
             text ? my_ref.current.value = text : my_ref.current.value = ''
        }
       
    }




    function SaveTag() {
        if (my_ref.current.value.length < 5) {
            setmessage('Слишком короткий! Минимум 10 букв')
            setTimeout(() => setmessage(''), 2000)
            return;
        }
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
                my_ref.current.value
                setmessage('Коментарий сохранён.')
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }


    async function selectUpload(e) {
        // e.preventDefault()
        if (!e.target.files[0]) return
        const prof = JSON.parse(localStorage.getItem('profile'))
        let id = await fetch('/api/add_image', {
            method: 'POST',
            body: JSON.stringify({
                nikname: prof.nikname,
                service: services__name[tag],
                city: prof.city,
                master_name: prof.name
            })
        })
            .then(res => res.json())
            .then(res => res)
        let data = new FormData()
        let file_name = id + '.jpg'
        data.append('file', e.target.files[0], file_name)
        fetch('/api/replace_icon', {
            method: 'POST',
            body: data,
        })
            .then(res => res.text())
            .then(res => {
                setmessage('Публикация отправлена на модерацию')
                mutate(`/api/get_images?nikname=${nikname}`)
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))

    }
    function deleteImage(e) {
        e.stopPropagation()
        fetch(`/api/delete_images?id=${e.target.id}`)
        .then(res => res.text())
        .then(res => {
            setmessage('Изображение удалён0')
            mutate(`/api/get_images?nikname=${nikname}`)
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
                    {images?.filter(i => i.service === tag.toLowerCase()).map(i =>
                        <div
                            key={i.id}                                                    
                            className={styles.sertificats}
                            style={{ border: i.id === +activeImage ? "2px solid " + color[1] : '', backgroundImage: "url(https://masters.place/images/" + i.id + '.jpg' }}
                        >
                            <span  id={i.id}   onClick={SetForTag} title="Добавить комментарий">
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
                    )}
                </form>
                <section className={styles.services}>
                    {services?.map(i =>
                        <span
                            key={i}
                            className={tag === i ? styles.active__service : null}
                            style={{backgroundColor: tag === i ? color[1] : null }}
                            onClick={() => {
                                settag(i)
                               
                                setActiveImage(null)
                            }}
                        >
                            {i}
                        </span>
                    )}
                </section>

                {activeImage ? <label className={styles.addtag}>
                    Добавьте комментарий к публикации
                    <textarea
                        ref={my_ref}
                        maxLength="500"
                        placeholder='Ваш комментарий'
                        rows={10}
                        style={{ borderColor: color[1] }}
                    />
                    <button  onClick={SaveTag} style={{ ...active, backgroundColor: color[1] }}>
                        Сохранить
                    </button>
                </label> : <p className={styles.publ}>Выберите публикацию для добавления комментария</p>}

            </>
                :
                <Event nikname={nikname} color={color} sel={selector} />
            }
        </main>
    )
}