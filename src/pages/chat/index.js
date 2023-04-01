import Header from '@/components/header'
import  styles  from './chat.module.css'
import { useState } from 'react'
import Link from 'next/link'

const chat = [
    {image:'one', name: 'Виталий Укупник', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '12:33' },
    {image:'two', name: 'Александрова Анна', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '10:03' },
    {image:'three', name: 'Григорьев Платон', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '12 ноября' },
    {image:'four', name: 'Михайлов Роберт', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '22 ноября' },
    {image:'five', name: 'Новикова Ева', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '10 ноября' },
    {image:'six', name: 'Серебряков Дмитрий', text: 'Меня не интересует где вам делать шугаринг. Главное что бы платили мне денег.', date: '2 ноября' }
]

export default function Chat() {
    const [new_message, setNew_Message] = useState(['Новикова Ева'])
    return (
        <>
            <Header sel="/" text="Чаты" />
            <section>
                {chat.map(i=>
                    <Link href={'/chat/messages/' + i.name} key={i.name} className={styles.chat} style={{backgroundImage:'url(/chat/' + i.image + '.jpg'}}>
                        <p className={new_message.includes(i.name) ? styles.new:null}><b>{i.name}</b><span>{i.date}</span></p>
                        <span>{i.text}</span>
                    </Link>
                )}
            </section>


        </>
    )
}

