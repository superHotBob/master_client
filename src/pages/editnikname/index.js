import styles from './editnikname.module.css'
import Image from 'next/image'
import arrow from '../../../public/arrow_back.svg'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function EditNikname() {
    const router = useRouter()
    const [newnikname, setnewnikname] = useState('testname')
    const [copyring, setcopyring] = useState(false)
    function CopyLink() {
        navigator.clipboard.writeText(`http://localhost:3000/master/${newnikname}`);
       setcopyring(true)
       setTimeout(()=>setcopyring(false),3000)
    }
    function ViewCurrentName(e) {
        setnewnikname(e.target.value)
        if(e.target.value.length > 3) {
            fetch(`/api/view_name?name=${e.target.value}`)
            .then(res=>res.json())
            .then(res=>{
                if( res.length != 0 ) {
                    document.getElementById("name").style.display = 'block'
                    document.getElementById("name").style.color = 'red'
                    document.getElementById("name").innerText = "недопустимый nikname"
                } else {
                    document.getElementById("name").style.display = 'none'
                }
            })
        } else {
            return
        }    
    }
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>Короткое имя</h4>
                <span>Принять</span>
            </header>
            <section className={styles.main_block}>
            <p>{`Вы можете указать своё короткое имя, чтобы другим
             людям было проще вас найти или упомянуть в своих 
             записях. Ваше короткое имя: `}<span>@{newnikname}</span>
            </p>
            <p>Ваша ссылка MasterPlace: <b>master.palce/{newnikname}</b></p>
            <input type="text" onChange={ViewCurrentName} minLength={4}/>
            <span id="name"/>
            <span onClick={CopyLink}>Скопировать ссылку</span>
            {copyring ? <h2>Скопировано в буфер</h2> : null}
            </section>

        </>
    )
}