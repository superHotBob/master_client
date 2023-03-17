import Header from "@/components/header"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import styles from './messages.module.css'
import { useSelector } from "react-redux"

const all_messages = [
    {id:1, name: 'Bob', date: "12:30", message: "Добрый день. Как ваши дела? Хотела спросить. Что если я захочу сделать себе шугарин на шее? Это можно называть шугарингом?" },
    {id:2, name: 'Виктория Ченг', date: "12:35", message: "Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег." },
    { id:3, name: 'Bob', date: "12:40", message: "Спасибо виктория, тогда я готова заказать услугу." },
    {id:4,  name: 'Виктория Ченг', date: "12:45", message: "Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег." },
    {id: 5, name: "admin", date: '', message: "Вы оплатили заказ, мастер в курсе." },
    { id: 6,
        name: 'Виктория Ченг', date: "12:45", message:
            `Создан заказ #2345 - Ноготочки на завтра.
        Статус - оплачен.\n
        Детали заказа:\n
        Дата встречи: Завтра, 12:00
        Адрес встречи: Ул. Павла Толстого, дом 19, кв 3.
        `}
]

export default function Messages() {
    const router = useRouter()
    const ref = useRef()
    const [messages, addMessage] = useState(all_messages)
    const profile = useSelector(state => state.counter.profile)
    useEffect(() => {
        const objDiv = document.getElementById("section");
        objDiv.scrollTop = objDiv.scrollHeight;
    },)

    function SendMessage() {
        const d = new Date()
        let message = {id: messages[messages.length-1].id + 1, name: 'Виктория Ченг', date: d.getHours() + ':' + d.getMinutes(), message: ref.current.value }
        if (ref.current.value.length > 1) {
            addMessage(state => [...state, message])
            setTimeout(()=>ClientMessage(),2000)
        }
    }
    function ClientMessage() {
        const d = new Date()
        let message = { name: 'Bob', date: d.getHours() + ':' + d.getMinutes(), message: 'Hello Виктория. How are You?' }

        addMessage(state => [...state, message])

    }
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={profile.username} mes="1"/>
            <section className={styles.section} id="section">
                {messages.map(i =>
                    <div style={{ backgroundImage: i.name === 'Виктория Ченг' ? "url(/image/redbull.jpg" : null }}>
                        <div key={i.id}
                            className={i.name === 'Виктория Ченг' ? styles.master :
                                i.name === 'admin' ? styles.admin :
                                    styles.client}
                        >
                            {i.message}
                            <p>{i.date}</p>
                        </div>
                    </div>
                )}

            </section>

            <div className={styles.input}>
                <input type="text" placeholder="Сообщение" ref={ref} />
                <div onClick={SendMessage} />
            </div>

        </main>
    )
}