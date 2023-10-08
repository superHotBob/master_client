import styles from './editnikname.module.css'
import Image from 'next/image'
import arrow from '../../../public/arrow_back.svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { EditLocalStorage } from '@/profile'

export default function EditNikname() {
    const router = useRouter()
    const profile = useSelector(state => state.counter.profile)
    const [newnikname, setnewnikname] = useState()
    const [copyring, setcopyring] = useState('')

    useEffect(() => setnewnikname(profile.nikname), [profile])

    function CopyLink() {
        navigator.clipboard.writeText(`${location.origin}/${newnikname}`);
        setcopyring('Скопировано в буфер')
        setTimeout(() => setcopyring(''), 3000)
    }

    function ViewCurrentName(e) {
        setnewnikname(e.target.value)
        let str = e.target.value

        const regex = /[/А-я,ё// //.//;//://-//*//?//$//%/]/g;

       
      
        const found = str.match(regex);
        if (found?.length > 0) {
            document.getElementById("name").style.display = 'block'
            document.getElementById("name").style.color = 'red'
            document.getElementById("name").innerText = "Только латинские буквы,цифры, дефис и нижнее подчёркивание"
            document.getElementById("change").style.opacity = 0
            return;
        }
        if (e.target.value.length > 3) {
            fetch(`/api/view_name?name=${e.target.value}`)
                .then(res => res.text())
                .then(res => {
                    if (+res > 0) {
                        document.getElementById("name").style.display = 'block'
                        document.getElementById("name").style.color = 'red'
                        document.getElementById("name").innerText = "Недопустимый nikname"

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
        if (!profile.nikname) { return; }
        // if( document.getElementById("change").style.opacity === 1) { return; }

        await fetch(`/api/edit_nikname?newnikname=${newnikname}&oldnikname=${profile.nikname}`)
            .then(res => res.text())
            .then(res => {
                EditLocalStorage('nikname', newnikname)
                setcopyring('Nikname изменён. ')
                setTimeout(() => setcopyring(''), 3000)
                router.push(`/${newnikname}`)
            })
    }
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <h4>Короткое имя</h4>
                <button id="change" onClick={ChangeNikname}>Принять</button>
            </header>
            <section className={styles.main_block}>
                <p>{`Вы можете указать своё короткое имя, чтобы другим
             людям было проще вас найти или упомянуть в своих 
             записях. Ваше короткое имя: `}<span>@{newnikname}</span>
                </p>
                <p>Ваша ссылка MasterPlace: <b>master.palce/{newnikname}</b></p>

                <input
                    type="text"
                    onChange={ViewCurrentName}
                    minLength={4}
                    placeholder='Новый nikname'
                    required
                />



                <span id="name" />
                <span onClick={CopyLink}>Скопировать ссылку</span>
                {copyring ? <h2>{copyring}</h2> : null}
            </section>

        </>
    )
}