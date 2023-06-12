import Header from '@/components/header'
import styles from './chat.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Chat() {
    const [chat, setchat] = useState()
    const [my_chat, setmychat] = useState()  
    const [resive, setresive] = useState(true) 
    const router = useRouter()
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'))
        const myChat = JSON.parse(localStorage.getItem('chat'))
        setmychat(myChat)
        console.log(myChat)
        if(!profile){
            return router.push('/')
        }
        
        fetch(`/api/get_messages?nikname=${profile.nikname}`)
            .then(res => res.json())
            .then(res => {
                setchat(res)
                let chat = {}
                res.forEach(element => chat[element.sendler] = element.ms_date)
                localStorage.setItem('chat',JSON.stringify(chat))
            })
    }, [resive])
    const options_time = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    const ToDate = (a) => {
        const dt = new Date(+a)
        return dt.toLocaleDateString('ru-RU', options_time)
    }
    const NewMessage = (a,b) => {
        console.log(a,my_chat[b])
        if(+a > +my_chat[b]) {
            return false
        } else {
            return true
        }
    }
    return (
        <>
            <Header sel="/" text="Чаты" />
            <section>
                <Link href='/chat/messages/администратор' className={styles.chat}>
                    <img src="/chat/администратор.jpg" height={55} width={55} alt="master" />
                    <div>
                        <p><b>Администратор</b><span>{12 + ':' + 33}</span></p>
                        <span>Отвечу на любые вопросы</span>
                    </div>
                </Link>
                <div onClick={()=>setresive(!resive)}>
                {chat?.map(i =>
                    <Link href={'/chat/messages/' + i.sendler_nikname + '?name=' + i.sendler}
                        key={i.sendler}
                        className={styles.chat}
                    >
                        <img src={process.env.url + 'var/data/' + i.sendler_nikname + '/main.jpg'} height={55} width={55} alt="masre" />
                        <div>
                            <p>
                                <b>{i.sendler}</b>
                                <span>{ToDate(i.ms_date)}</span>
                            </p>
                            <span className={NewMessage(i.ms_date,i.sendler) ? styles.new_message : null}>
                                {i.ms_text}
                            </span>
                        </div>

                    </Link>
                )}
                </div>

            </section>
        </>
    )
}

