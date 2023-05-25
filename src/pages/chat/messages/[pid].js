import Header from "@/components/header"
import { useEffect, useRef, useState } from "react"
import styles from './messages.module.css'
import { useSelector } from "react-redux"
import { useRouter } from "next/router"


const options = {   
    month: '2-digit',
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
    const profile = useSelector(state => state.counter.profile)
    useEffect(() => {
        async function Bob() {
            let pro = await JSON.parse(localStorage.getItem("profile"))
            setColor(pro)
                    
        }
        if(pid === 'Администратор') {
            addMessage([])
        }       
      Bob() 
        fetch(`/api/get_from_admin?name=${profile.name}`)
        .then(res=>res.json())       
        .then(res => {           
            addMessage(res)
            Movie()   
        })
        .catch(err => console.log(err))     
    },[])  
    function Movie() {
        const objDiv = document.getElementById("section");
        objDiv.scrollTop = objDiv.scrollHeight;
    } 
    function SendMessage() {
        const d = new Date()
        // let message = {id: messages[messages.length-1].id + 1, name: 'Виктория Ченг', date: d.getHours() + ':' + d.getMinutes(), message: ref.current.value }
        if (ref.current.value.length > 1) {
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
            addMessage(messages =>([...messages, {ms_user:profile.name,ms_text:ref.current.value,ms_date:d}]))
            Movie() 
        })
        .catch(err => console.log(err))
    }
    }
    function My_Date(a) {
        const d = new Date(+a)
        return a ? d.toLocaleDateString('ru-RU',options) : null
      }
    return (
        <main className={styles.main}>           
            <Header sel='/chat' text={profile.name} mes="1" color={color}/>           
            <section className={styles.section} id="section">
                {messages.sort((a,b)=> a.id - b.id).map(i =>
                    <div key={i.id} className={styles.message}>
                        <div className={styles.client}>                        
                            {i.ms_text}
                            <p>{My_Date(+i.ms_date)}</p>
                        </div>
                        {i.answer ?
                        <div style={{ backgroundImage: 'url(/chat/администратор.jpg' }} className={styles.wrap_master}>

                       
                        <div  className={styles.master}> 
                        {i.answer}
                        <p>{My_Date(+i.date_answer)}</p>
                        </div>
                        </div>
                        
                        :null}
                           
                       
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