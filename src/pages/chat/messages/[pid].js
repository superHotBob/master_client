import Header from "@/components/header"
import { useEffect, useRef, useState } from "react"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"


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
    const [messages, addMessage] = useState([])
    const [color, setColor] = useState()
    const [resive, setresive] = useState(true)
    const profile = useSelector(state => state.counter.profile)
    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setColor(pro)
        if (pid === 'Администратор') {
            addMessage([])
        }
        if (pid === 'Администратор') {
            fetch(`/api/get_from_admin?name=${profile.name}`)
                .then(res => res.json())
                .then(res => {
                    addMessage(res)
                    Movie()
                })
                .catch(err => console.log(err))
        } else {
            if(!pid) {
                return;
              }
            console.log(pid)
            fetch(`/api/get_messages_master?my_name=${pro.nikname}&abonent=${pid}`)
                .then(res => res.json())
                .then(res => {
                    addMessage(res)
                    Movie()
                })
                .catch(err => console.log(err))
        }
    }, [pid,resive])
    function Movie() {
        const objDiv = document.getElementById("section");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    function SendMessage() {
        const d = new Date()
        // let message = {id: messages[messages.length-1].id + 1, name: 'Виктория Ченг', date: d.getHours() + ':' + d.getMinutes(), message: ref.current.value }
        if (!ref.current.value) {
            return
        }
        if (pid === 'администратор') {
            const data = {
                text: ref.current.value,
                user: profile.name,
                date: Date.now()
            }
           
            fetch('/api/send_to_admin', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
                .then(res => {
                    let d = Date.now()
                    addMessage(messages => ([...messages, { ms_user: profile.name, ms_text: ref.current.value, ms_date: d }]))
                    Movie()
                })
                .catch(err => console.log(err))
        } else if (profile.status === 'client') {
            const data = {
                ms_text: ref.current.value,
                sendler: profile.name,
                sendler_nikname: profile.nikname,
                recipient_nikname: pid,
                recipient: router.query.name,
                ms_date: Date.now()
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
                    addMessage(messages => [...messages, data ])
                    Movie()
                   ref.current.value = ''
                })
                .catch(err => console.log(err))
        } else {
           
            const data = {
                ms_text: ref.current.value,
                sendler: profile.name,
                sendler_nikname: profile.nikname,
                recipient_nikname: pid,
                recipient: router.query.name,
                ms_date: Date.now()
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
                    addMessage(messages => [...messages,data])
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        }
    }
    function My_Date(a) {
        const d = new Date(+a)
        return d.toLocaleDateString('ru-RU', options) 
    }
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={profile.name} mes="1" color={color} />
            <section className={styles.section} id="section" onClick={()=>setresive(!resive)}>
                {messages.sort((a, b) => a.ms_date - b.ms_date).map(i =>
                    <div key={i.ms_date} className={styles.message}>
                        {i.sendler === profile.name ?
                            <div className={styles.client}>
                                {i.ms_text}
                                <p>{My_Date(+i.ms_date)}</p>
                            </div>
                            :
                            <div className={styles.wrap_master}>
                                <img src={process.env.url + 'var/data/' + i.sendler_nikname + '/main.jpg' } height={50} width={50} alt="masre" />
                                <div className={styles.master}>
                                    {i.ms_text}
                                    <p>{My_Date(+i.ms_date)}</p>
                                </div>
                            </div>
                        }
                    </div>
                )}

            </section>

            <div className={styles.input}>
                <input type="text" placeholder="Сообщение" ref={ref} />
                <button onClick={SendMessage} />
            </div>

        </main>
    )
}