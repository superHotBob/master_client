import Message from '@/components/message'
import { useEffect, useState } from 'react'
import Menu_icon from '../../components/icons/menu'
import styles from './addlist.module.css'

const url = 'https://masters-client.onrender.com'
const url_loc = 'http://localhost:5000'

const active = {
    color: "#fff",
   
    borderRadius: "4px",
    fontWeight: 500
}

export default function AddList() {
    const [lists, setlists] = useState()
    const [select, setselect] = useState(true)
    const [nikname, setnikname] = useState()
    const [color, setColor] = useState([])
    useEffect(() => {
        const prof = JSON.parse(localStorage.getItem('profile'))
        setnikname(prof.nikname)
        setColor([...prof.color])
       
        async function GetSertificats() {
            fetch(`${url}/getlists?dir=${prof.nikname}`)
                .then(res => res.json())
                .then(res => setlists(res))
        }
        GetSertificats()
    }, [])
    function DeleteSertif(a) {
        fetch(`${url}/deleteslist?name=${nikname}&list=${a}`)
            .then(res => Del_Ser(a))
            .catch(err => console.log(err))
    }
    function Del_Ser(a) {
        lists.filter(i => i !== a)

    }
    function selectUpload(e) {
        e.preventDefault()
        let data = new FormData()        
        let file_name = 'list' + (Math.random() * 1000).toFixed(0) + '.jpg'
        data.append('file', e.target.files[0], file_name)        
        fetch(`${url}/upl?name=${nikname}`, {
            body: data,
            method: 'post',
        })
        .then(res => setlists(lists => [...lists, file_name]))
        .catch(err => console.log(err))
    }
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Menu_icon color={color[1]} type="arrow" />
                <span >Добавить публикацию</span>
                <span style={{color: color[1]}}>Отправить</span>
            </header>
            <Message text="Вы можете опубликовать работу или создать пост о 
                поиске моделей, который будет отображаться в 
                соответсвующем меню на сервисе." 
                color={color}
            />
            <div className={styles.selector} onClick={()=>setselect(!select)}>
                <span style={select ? {...active,backgroundColor:color[1]} : null}>Выполненная работа</span>
                <span style={select ? null : {...active,backgroundColor:color[1]}}>Поиск моделей</span>
            </div>
            <form className={styles.main__form}>
                <label className={styles.sertificat__upload} style={{color: color[1], backgroundColor: color[2] }}>
                    +
                    <input
                        type="file"
                        name="image"
                        style={{ display: 'none' }}
                        accept=".jpg"
                        onChange={(e)=>selectUpload(e)}
                    />
                </label>
                {lists?.map(i =>
                    <div key={i} className={styles.sertificats} style={{ backgroundImage: "url(" + url + "/var/data/" + nikname + '/' + i }} >
                        <span style={{color: color[1]}} onClick={() => DeleteSertif(i)}>&#128465;</span>
                    </div>)}

            </form>

        </main>
    )
}