import Header from '@/components/header'
import styles from './chat.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Chat() {
    const [chat, setchat] = useState()
    const [status, setstatus] = useState()
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'))
        setstatus(profile.status)
        fetch(`/api/get_messages?nikname=${profile.nikname}`)
            .then(res => res.json())
            .then(res => setchat(res))
    }, [])
    const options_time = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    function ToDate(a) {
        const dt = new Date(+a)
        return dt.toLocaleDateString('ru-RU', options_time)
    }
    return (
        <>
            <Header sel="/" text="Чаты" />
            <section>
                <Link href='/chat/messages/администратор' className={styles.chat}>
                    <img src="/chat/администратор.jpg" height={55} width={55} alt="masre" />
                    <div>
                    <p><b>Администратор</b><span>{12 + ':' + 33}</span></p>
                    <span>Отвечу на любые вопросы</span>
                    </div>
                </Link>
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
                            <span>{i.ms_text}</span>
                        </div>

                    </Link>)}

            </section>
        </>
    )
}

