import Header from '@/components/header'
import styles from './chat.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
const fetcher = (...args) => fetch(...args).then(res => res.json())
import useSWR from 'swr'

export default function Chat() {

    const name = useSelector(state => state.counter.profile['nikname'])
    const status = useSelector(state => state.counter.profile['status'])
    const { data, error , mutate } = useSWR(`/api/get_messages?nikname=${name}&status=${status}`, fetcher, { refreshInterval: 30000 })

    const router = useRouter()
    
    
    if (error) return router.push('/')

    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    function My_Date(a) {
        console.log(typeof a)
        const message_date = new Date(+a)
        const current_date = new Date()
        if (message_date.getDate() === current_date.getDate()) {
            return message_date.toLocaleDateString('ru-RU', options).slice(-5)
        }
        return message_date.toLocaleDateString('ru-RU', options)
    }
    const NewMessage = (a, b, c) => {
        if (c === name) { return false }
        const myChat = JSON.parse(localStorage.getItem('chat'))

        let time_last_message = (myChat ? myChat[c] ?? 0 : 0)

        if (+a >= time_last_message) {
            return true
        } else {
            return false
        }
    }
    return (
        <>
            <Header sel="/" text="Чаты" />
            <section>
                {data?.admin.map(i =>
                    <Link
                        href='/chat/messages/администратор'
                        key={i.recipient}
                        className={styles.chat}
                    >
                        <img src="/chat/администратор.jpg" alt="master" />
                        <div>
                            <p>
                                <b>Администратор</b>
                                <span>{My_Date(i.ms_date)}</span>
                            </p>
                            <span className={NewMessage(i.ms_date, i.recipient_nikname, i.sendler_nikname) ? styles.new_message : null}>
                                {i.ms_text}
                            </span>
                        </div>
                    </Link>
                )}
                {data?.admin.length === 0 ? <Link href='/chat/messages/администратор' className={styles.chat}>
                    <img src="/chat/администратор.jpg" alt="master" />
                    <div>
                        <p><b>Администратор</b><span>{'12:33'}</span></p>
                        <span>Отвечу на любые вопросы</span>
                    </div>
                </Link> : null}
                <div>
                    {data?.client.map(i =>
                        <Link
                            href={'/chat/messages/' + (i.sendler_nikname === name ? i.recipient_nikname : i.sendler_nikname) + '?name=' + (i.sendler === name ? i.recipient : i.sendler)}
                            key={i.recipient}
                            className={styles.chat}
                        >
                            <img src={process.env.url + 'var/data/' + (i.sendler_nikname === name ? i.recipient_nikname : i.sendler_nikname) + '/main.jpg'} alt="master" />
                            <div>
                                <p>
                                    <b>{i.sendler_nikname === name ? i.recipient : i.sendler}</b>
                                    <span>{My_Date(i.ms_date)}</span>
                                </p>
                                <h6 className={NewMessage(i.ms_date, i.recipient_nikname, i.sendler_nikname) ? styles.new_message : null}>
                                    {i.ms_text.slice(0,12)}
                                </h6>
                            </div>

                        </Link>
                    )}
                </div>

            </section>
        </>
    )
}

