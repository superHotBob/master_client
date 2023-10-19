import Header from "@/components/header"
import { useRef, useState } from "react"
import Link from "next/link"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import useSWR , { mutate } from 'swr'
import Image from 'next/image'
import OrderMessage from "@/components/ordermessage"

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
    const [link, setlink] = useState(null)
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
               
                return a?.length === b?.length
            }
        }
    )
    setTimeout(() => Movie(), 500)
  
    function Movie() {  
        if( document.getElementById("section"))  {   
        const objDiv = document.getElementById("section");
        objDiv.scrollTop = objDiv.scrollHeight;
        }
    }   
    function SendMessage() {
        const d = new Date()
        if (!ref.current.value) {
            return
        }
       
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
                    Movie()
                    ref.current.value = ''
                })
                .catch(err => console.log(err))
        } else {
            const data = {
                chat: (dialog.length > 0 && dialog[0].chat != 0) ? dialog.filter(i=>i.recipient_nikname ===  profile.nikname)[0].chat : null,
                ms_text: ref.current.value,
                sendler: profile.name,
                sendler_nikname: profile.nikname           
            }
            fetch('/api/send_message_admin', {
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
    function FindLink(text) {
        let match = text.match(/\bhttps?\:\/\/(\S+)\b/);       
        if(match) {           
            return <a href = {match[0]} >{match[1]}</a>
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
    
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={router.query.name} name={pid} mes="1" color={color} />            
            <section className={styles.section} id="section">
                {dialog?.sort((a, b) => a.ms_date - b.ms_date).map(i =>
                    <div key={i.ms_date} className={styles.message}>
                        {i.sendler === profile.name ?
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
                                    title={i.sendler}
                                    src={i.sendler === 'администратор' ?
                                        "/image/администратор.jpg" :
                                        process.env.url_image + i.sendler_nikname + '.jpg'
                                    }
                                    height={50} width={50}
                                    alt="sendler"
                                />
                                <div className={styles.master}>                                  
                                   <OrderMessage id={i.ms_text} color="#000" profile={profile} />
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