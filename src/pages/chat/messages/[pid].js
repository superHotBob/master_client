import Header from "@/components/header"
import { useEffect, useRef, useState } from "react"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
const fetcher = (...args) => fetch(...args).then(res => res.json())
import useSWR from 'swr'

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
   
    const color = useSelector(state=>state.counter.profile['color'])
    const [resive, setresive] = useState(true)
    const profile = useSelector(state => state.counter.profile)

    const { data: client , error, isLoading } = useSWR(`/api/get_messages_master?my_name=${profile.nikname}&abonent=${pid}`, fetcher, { refreshInterval: 5000 })  
   
    if(client) {
        console.log(client)
        let ch = JSON.parse(localStorage.getItem("chat"))
        setTimeout(() => {
            Movie()
        }, 500) 
        let new_ch = ch ? ch: {}
        new_ch[pid] = Date.now()                    
        localStorage.setItem('chat',JSON.stringify(new_ch))
        // addMessage(client)
    }
    

    // useEffect(() => {
    //     let pro = JSON.parse(localStorage.getItem("profile"))
       

       
    //     if (pid === 'Администратор') {
    //         addMessage([])
    //     }
      
       
    //     if (pid === 'Администратор') {
    //         fetch(`/api/get_from_admin?name=${profile.name}`)
    //         .then(res => res.json())
    //         .then(res => {
    //             addMessage(res)
    //             Movie()
    //         })
    //         .catch(err => console.log(err))
    //     } else {
    //         if(!pid) {
    //             return;
    //           }
    //         let ch = JSON.parse(localStorage.getItem("chat"))
    //         fetch(`/api/get_messages_master?my_name=${pro.nikname}&abonent=${pid}`)
    //             .then(res => res.json())
    //             .then(res => {
    //                 addMessage(res)
    //                 Movie()
    //                 let new_ch = ch? ch: {}
    //                 new_ch[pid] = Date.now()                    
    //                 localStorage.setItem('chat',JSON.stringify(new_ch))
    //             })
    //             .catch(err => console.log(err))
    //     }
       
    // }, [pid,resive])

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
                user_nikname: profile.nikname,
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
                chat: client.length > 0 ? client[0].chat: Math.random().toFixed(6)*1000000 ,
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
                    // addMessage(messages => [...messages, data ])
                    
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        } else {           
            const data = {
                chat: client.length > 0 ? client[0].chat: Math.random().toFixed(6)*1000000 ,
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
                    // addMessage(messages => [...messages,data])
                    Movie()
                   
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        }
    }
    function My_Date(a) {
        const d = new Date(a)
        const n = new Date()
        if(d.getDate() === n.getDate()) {
            return d.toLocaleDateString('ru-RU', options).slice(-5) 
        } 
        return d.toLocaleDateString('ru-RU', options) 
    }
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={profile.name} mes="1" color={color} />
            <section className={styles.section} id="section">
                {client?.sort((a, b) => a.ms_date - b.ms_date).map(i =>
                    <div key={i.ms_date} className={styles.message}>
                        {i.sendler === profile.name ?
                            <div className={styles.client}>
                                {i.ms_text}
                                <p>{My_Date(+i.ms_date)}</p>
                            </div>
                            :
                            <div className={styles.wrap_master}>
                                <img title={i.sendler} src={process.env.url + 'var/data/' + i.sendler_nikname + '/main.jpg' } height={50} width={50} alt="master" />
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
                <input type="text" placeholder="Ваше сообщение" ref={ref} />
                <button onClick={SendMessage} title="отправить сообщение"/>
            </div>

        </main>
    )
}