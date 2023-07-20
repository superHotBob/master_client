import styles from './editnikname.module.css'
import Image from 'next/image'
import arrow from '../../../public/arrow_back.svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function EditNikname() {
    const router = useRouter()
    const profile = useSelector(state=>state.counter.profile)
    const [newnikname, setnewnikname] = useState()
    const [copyring, setcopyring] = useState(false)
    useEffect(()=>setnewnikname(profile.nikname),[profile])
    function CopyLink() {
       navigator.clipboard.writeText(`${location.origin}/${newnikname}`);
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
                    document.getElementById("change").style.opacity = 1
                }
            })
        } else {
            document.getElementById("change").style.opacity = 0
            return
        }    
    }
    async function ChangeNikname() {
        console.log('dfsd')
        let ch = await fetch(`/api/change_nikname?newnikname=${newnikname}&oldnikname=${profile.nikname}`)
        .then(res=>res.json())
        .then(res=>{})
        
    }
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>Короткое имя</h4>
                <span  id="change" onClick={ChangeNikname}>Принять</span>
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