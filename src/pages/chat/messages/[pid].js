import Header from "@/components/header"
import { useRef } from "react"
import Link from "next/link"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import useSWR from 'swr'
import Image from 'next/image'

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

    const color = useSelector(state => state.counter.profile['color'])

    const profile = useSelector(state => state.counter.profile)

    const { data: dialog } = useSWR(`/api/get_messages_onebyone?nikname=${profile.nikname}&abonent=${pid}&status=${profile.status}`,
        {
            refreshInterval: 5000, onSuccess:
            () => {
                    let ch = JSON.parse(localStorage.getItem("chat"))
                   
                    let new_ch = ch ? ch : {}
                    new_ch[pid] = Date.now()
                    localStorage.setItem('chat', JSON.stringify(new_ch))
            },compare(a,b){
               
                return a.length === b.length
            }
        }
    )
    setTimeout(() => Movie(), 500)

  
    function Movie() {       
        const objDiv = document.getElementById("section");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    console.log('render')
    function SendMessage() {
        const d = new Date()
        if (!ref.current.value) {
            return
        }
        // if (pid === 'администратор') {
        //     const data = {
        //         text: ref.current.value,
        //         user: profile.name,
        //         user_nikname: profile.nikname,
        //         date: Date.now()
        //     }

        //     fetch('/api/send_to_admin', {
        //         body: JSON.stringify(data),
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         method: 'POST',
        //     })
        //         .then(res => {
        //             let d = Date.now()
        //             addMessage(messages => ([...messages, { ms_user: profile.name, ms_text: ref.current.value, ms_date: d }]))
        //             Movie()
        //         })
        //         .catch(err => console.log(err))
        // } else 
        if (pid !== 'администратор') {
            const data = {
                chat: dialog.length > 0 ? dialog[0].chat : null,
                ms_text: ref.current.value,
                sendler: profile.name,
                sendler_nikname: profile.nikname,
                recipient_nikname: pid,
                recipient: router.query.name,
                ms_date: Date.now(),
                phone: profile.phone
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
                    // addMessage(messages => [...messages, data ])

                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        } else {
            const data = {
                chat: (dialog.length > 0 && dialog[0].chat != 0) ? dialog.filter(i=>i.recipient_nikname ===  profile.nikname)[0].chat : null,
                ms_text: ref.current.value,
                sendler: profile.name,
                sendler_nikname: profile.nikname,
                recipient_nikname: 'администратор',
                recipient: 'администратор',
                ms_date: Date.now(),

            }
            fetch('/api/send_message', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
                .then(res => {
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        }
    }
    function My_Date(a) {
        const d = new Date(a)
        const n = new Date()
        if (d.getDate() === n.getDate()) {
            return d.toLocaleDateString('ru-RU', options).slice(-5)
        }
        return d.toLocaleDateString('ru-RU', options)
    }
    function ReadText(a, b) {
        if (a.includes(';')) {
            let ss = a.split(';')
            return <div style={{ color: b }} className={styles.order}>
                <p>Создан заказ
                    {b === '#fff' ?
                        <Link style={{ color: '#fff' }} href={'/order/' + ss[1]}>{' '} #{ss[1]} -</Link>
                        :
                        <Link style={{ color: '#3D4EEA' }} href={'/clientprofile/' + profile.nikname + '/orders'}>{' '} #{ss[1]} -</Link>}
                </p>
                <p>{ss[2]}</p>
                <p className={styles.details}>Детали заказа</p>
                <p>{ss[4]}</p>
                <p>{ss[5]}</p>
                <h4>{ss[6]} BYN</h4>
            </div>
        } else {
            return a
        }
    }
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={router.query.name} name={pid} mes="1" color={color} />
            <section className={styles.section} id="section">
                {dialog?.sort((a, b) => a.ms_date - b.ms_date).map(i =>
                    <div key={i.ms_date} className={styles.message}>
                        {i.sendler === profile.name ?
                            <div className={styles.wrap_client}>
                                {ReadText(i.ms_text, '#fff')}
                                <p>{My_Date(+i.ms_date)}
                                    {i.read ? <Image height={20} width={20} alt="check" src="/check_to.svg" /> : null}
                                </p>
                            </div>
                            :
                            <div className={styles.wrap_master}>
                                <img
                                    title={i.sendler}
                                    src={i.sendler === 'администратор' ?
                                        "/image/администратор.jpg" :
                                        process.env.url + 'var/data/' + i.sendler_nikname + '/main.jpg'
                                    }
                                    height={50} width={50}
                                    alt="master"
                                />
                                <div className={styles.master}>
                                    {ReadText(i.ms_text, '#000')}
                                    <span>
                                        {My_Date(+i.ms_date)}
                                    </span>
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