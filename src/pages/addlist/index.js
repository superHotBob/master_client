import Message from '@/components/message'
import { useEffect, useState, useRef, forwardRef } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'
import { url } from '@/data.'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)


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
    const [nikname, setnikname] = useState()
    const [color, setColor] = useState([])
    const [services, setServices] = useState()
    const [tag, settag] = useState()
    const [activeImage, setActiveImage] = useState()
    const [message, setmessage] = useState('')
    const [selector, setSelector] = useState(true)
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...prof.color])
        setServices(prof.services)
        fetch(`/api/get_images?nikname=${prof.nikname}`)
            .then(res => res.json())
            .then(res => setlists(res))
    }, [])


    function SetForTag(e) {
        e.stopPropagation()
        setActiveImage(e.target.id)
        let text = lists.filter(i => i.id === +e.target.id)[0]['review']
        my_ref.current.value = text ? text : 'Добавить комментарий'
    }

    function SaveEvent() {
        const body = JSON.stringify({
            nikname: nikname,
            service: tag,
            text: my_ref.current.value,
            date: Date.now(startDate)
        })
        fetch('/api/add_event', {
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
        .then(res => {
            setmessage('Мероприятие  сохранено')
            setTimeout(() => setmessage(''), 2000)
        })
        .catch(err => console.log(err))

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
        if (!e.target.files[0]) return
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
    // const CustomInput =  forwardRef(({ value, onClick }, ref) => (
    //     <button className={styles.custom_input} onClick={onClick} ref={ref} style={{ borderColor: color[1] }}>
    //       {value}
    //     </button>
    //   ));

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
            </>
                :
                <div className={styles.date} style={{ borderColor: color[1] }}>
                    <h3>Дата и время</h3>
                    <p>Выберите дату проведения события</p>
                    <DatePicker
                        locale="ru"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        className={styles.custom_input}
                        // customInput={<CustomInput />}

                    />
                    <section className={styles.tags}>
                        {services?.map(i =>
                            <h4
                                key={i}
                                className={tag === i ? styles.active__service : null}
                                onClick={() => {
                                    settag(i)

                                }}
                            >
                                {i}
                            </h4>
                        )}
                        <label className={styles.addtag}>
                            Расскажите о мероприятии подробнее...
                            <textarea
                                ref={my_ref}
                                maxLength="500"
                                placeholder='Ваш рассказ'
                                rows={10}
                                style={{ borderColor: color[1] }}
                            />
                            <button onClick={SaveEvent} style={{ ...active, backgroundColor: color[1] }}>Сохранить</button>
                        </label>
                    </section>

                </div>
            }
        </main>
    )
}