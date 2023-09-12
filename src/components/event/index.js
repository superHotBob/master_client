import DatePicker from "react-datepicker";
import useSWR from 'swr'
import { useState , useRef } from "react";
import styles from './event.module.css'
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import Link from "next/link";
registerLocale('ru', ru)
const active = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    display: 'block',
    width: '80%',
    textAlign: 'center',
    padding: '10px 6px',
    cursor: 'pointer',
    margin: '20px auto 0',
}
export default function Event({nikname,color}) {
    const [startDate, setStartDate] = useState(new Date())
    const textarea = useRef(null)
    const [ message, setmessage ] = useState()
    const { data } = useSWR(`/api/get_events_master?nikname=${nikname}`)
    
    const body = {
        nikname: nikname,      
        event_date: startDate
    }
   
    function SaveEvent() {  
        body['text'] =  textarea.current.value  
        
        fetch('/api/add_event', {
            body: JSON.stringify(body),
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
    function DeleteEvent() {
        fetch(`/api/delete_event?id=${data.event_id}`)
        .then(res=>res.text())
        .then(res => {
            console.log(res)
            setmessage(res)
            setTimeout(() => setmessage(''), 2000)
        })
    }
    if( data['event_id'] ) return <div className={styles.message}>
        У вас уже есть мероприятие. Удалите его , что-бы создать новое.
        <Link href='/event' style={{ ...active, backgroundColor: color[1] }}>Посмотреть</Link>
        <button onClick={DeleteEvent} style={{ ...active, backgroundColor: 'red' }}>Удалить</button>
        </div>
    return (
        <div className={styles.date} style={{ borderColor: color[1] }}>
            <h3>Дата и время </h3>
            <p>Выберите дату проведения события</p>
            <dialog open={message} className={styles.message_create}>
                {message}
            </dialog>
            <DatePicker
                locale="ru"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className={styles.custom_input}

            />
            <section className={styles.tags}>
                <label className={styles.addtag}>
                    Расскажите о мероприятии подробнее...
                    <textarea
                        ref={textarea}
                        maxLength="500"
                        placeholder='Ваш рассказ'
                        rows={10}
                        style={{ borderColor: color[1] }}
                    />
                    <button onClick={SaveEvent} style={{ ...active, backgroundColor: color[1] }}>
                        Сохранить
                    </button>
                </label>
            </section>
        </div>
    )
}