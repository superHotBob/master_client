import Header from "@/components/header"
import { useEffect, useRef } from "react"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import useSWR, { mutate } from 'swr'
import Image from 'next/image'
import OrderMessage from "@/components/ordermessage"
import { getImage } from "@/data."

const options = {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};


export default function Messages() {
    const ref = useRef()
    const router = useRouter()
    const { pid } = router.query
    

    // const profile = useSelector(state => state.counter.profile)
    const { color, name, status, nikname, phone } = useSelector(state => state.counter.profile)

    const { data: dialog } = useSWR(`/api/get_messages_onebyone?nikname=${nikname}&abonent=${pid}&status=${status}`,
        {
            refreshInterval: 5000,
            onSuccess: () => {

                if (pid === 'администратор') { localStorage.setItem('chat', Date.now()) }
            }, compare(a, b) { return a?.length === b?.length }
        }
    )
    setTimeout(() => Movie(), 500)
    function Movie() {
        if (document.getElementById("section")) {
            const objDiv = document.getElementById("section");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }
    function SendMessage() {
        if (!ref.current.value) {
            return
        }

        if (pid !== 'администратор') {
            const data = {
                chat: dialog.length > 0 ? dialog[0].chat : null,
                ms_text: ref.current.value,
                sendler: name,
                sendler_nikname: nikname,
                recipient_nikname: pid,
                recipient: router.query.name,
                ms_date: Date.now(),
                phone: phone
            }
            fetch('/api/send_message', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
                .then(res => {
                    let d = Date.now()
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        } else {
            const data = {
                chat: (dialog.length > 0 && dialog[0].chat != 0) ? dialog.filter(i => i.recipient_nikname === nikname)[0].chat : null,
                ms_text: ref.current.value,
                sendler: name,
                sendler_nikname: nikname
            }
            fetch('/api/send_message_admin', {
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            })
                .then(res => {
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        }
    }
    function FindLink(text) {
       
        let match = text.match(/\bhttps?\:\/\/(\S+)\b/);
       
        if (match) {           
            let text_split = text.split(match[0])
            return ( 
                <>
                <p>{text_split[0]}</p>
                <a href={match[0]}>{match[1]}</a>
                <b style={{ fontWeight: 400 }}>{text_split[1]}</b>
                </>
            )    
        } else {
            return parseInt(text) ? null : text
        }

    }
    function ViewMasterProfile(a) {
        if (status === 'client' && a != 'администратор') {
            router.push(window.location.origin + '/' + a)
            return;
        }

    }

    function My_Date(a) {
        const message_date = new Date(a)
        const current_date = new Date()
        if (message_date.getDate() === current_date.getDate()) {
            return message_date.toLocaleDateString('ru-RU', options).slice(-5)
        }
        return message_date.toLocaleDateString('ru-RU', options)
    }

    return (
        <main className={styles.main}>
            <Header sel='/chat' text={router.query.name} name={pid} mes="1" color={color} />
            <section className={styles.section} id="section">
                {dialog?.map(i =>
                    <div key={i.ms_date} className={styles.message}>
                        {i.sendler === name ?
                            <div className={styles.wrap_client}>
                                <OrderMessage id={i.ms_text} color="#fff" />
                                {FindLink(i.ms_text)}
                                <p>{My_Date(+i.ms_date)}
                                    {i.read ? <Image height={20} width={20} alt="check" src="/check_to.svg" /> : null}
                                </p>
                            </div>
                            :
                            <div className={styles.wrap_master}>
                                <img
                                    onClick={() => ViewMasterProfile(i.sendler_nikname)}
                                    title={i.sendler}
                                    style={{ cursor: status === 'client' ? 'pointer' : 'default' }}
                                    src={i.sendler === 'администратор' ?
                                        "/image/администратор.jpg" : getImage(i.sendler_nikname)
                                    }
                                    height={50} width={50}
                                    alt="sendler"
                                />
                                <div className={styles.master}>
                                    <OrderMessage id={i.ms_text} color="#000" /> 
                                    
                                    {FindLink(i.ms_text)}
                                  
                                    <span>{My_Date(+i.ms_date)}</span>
                                </div>
                            </div>
                        }
                    </div>
                )}
            </section>
            <div className={styles.input}>
                <input type="text" placeholder="Ваше сообщение" ref={ref} />
                <button onClick={SendMessage} title="отправить сообщение" />
            </div>
        </main>
    )
}