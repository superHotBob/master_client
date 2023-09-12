import { useEffect, useState, useRef } from 'react'
import Menu_icon from '../icons/menu'
import styles from './addsert.module.css'
const url = 'https://masters-client.onrender.com'

const active_button = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500
}

export default function AddSertificat({ nikname, view, color }) {
    const [sertificats, setserificats] = useState()
    const [active, setactive] = useState()
    const [message, setmessage] = useState()
    const my_ref = useRef()
    
    useEffect(() => {
        async function GetSertificats() {
            fetch(`${url}/getsertificats?dir=${nikname}`)
                .then(res => res.json())
                .then(res => setserificats(res))
        }
        GetSertificats()
    }, [])
    function DeleteSertif(a) {
        fetch(`${url}/deletesertificat?name=${nikname}&sertificat=${a}`)
        .then(res => Del_Ser(a))
        .catch(err => console.log(err))
    }
    function Del_Ser(a) {
        let new_sertificats = sertificats.filter(i => i !== a)
        setserificats([...new_sertificats])
    }
    function SaveTagSertificate() {
        console.log(active)
        fetch(`${url}/createtag?name=${nikname}`, {
            body: JSON.stringify({
                name: active,
                text: my_ref.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
            .then(res => {
                setmessage('Коментарий сохранён')
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }
    function selectUpload(e) {
        e.preventDefault()
        let data = new FormData()
        let s = sertificats.length + 1
        let file_name = 'sertificat' + (Math.random() * 1000).toFixed(0) + '.jpg'
        data.append('file', e.target.files[0], file_name)
        data.append('name', nikname)
        fetch(`${url}/upl?name=${nikname}`, {
            body: data,
            method: 'post',
        })
        .then(res => setserificats(sertificats => [...sertificats, file_name]))
        .catch(err => console.log(err))
    }
    function SetForTag(i) {             
        setactive(i)              
        let new_file = nikname + '/' + i       
        fetch(`${url}/readtext?file=${new_file}`)
        .then(res => res.text())
        .then(res=> my_ref.current.value = res )       
    }
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div
                    onClick={() => view(false)}
                    className={styles.left__arrow}

                >
                    <Menu_icon color={color[1]} />
                </div>
                <span>Добавить сертификат</span>
                <span style={{ color: color[1] }}></span>
            </header>
            <dialog open={message} className={styles.message}>
                {message}
            </dialog>
            <form className={styles.main__form}>
                <label title='Добавить сертификат' className={styles.sertificat__upload} style={{ color: color[1], backgroundColor: color[2] }}>
                    +
                    <input
                        type="file"
                        name="image"
                        style={{ display: 'none' }}
                        accept=".jpg,.png,.webp"
                        onChange={selectUpload}
                    />
                </label>
                {sertificats?.map(i =>
                    <div
                        key={i}
                        className={styles.sertificats}
                        style={{ border: active === i ? `4px solid ${color[1]}` : null, backgroundImage: "url(" + url + "/var/data/" + nikname + '/' + i }}
                    >
                        <span onClick={() => SetForTag(i)} title="Добавить комментарий">
                            <img
                                src='/trash.svg'
                                height={24}
                                title="удалить сертификат"
                                width={24}
                                alt="trash"
                                onClick={() => DeleteSertif(i)}
                            />
                        </span>
                    </div>
                )}

            </form>
            {active ?

                <label className={styles.addtag}>
                    Расскажите о сертификате подробнее...
                    <textarea
                        ref={my_ref}
                        maxLength="500"
                        placeholder='Ваш комментарий'
                        rows={10}
                        style={{ borderColor: color[1] }}
                    />
                    <div onClick={SaveTagSertificate} style={{ ...active_button, backgroundColor: color[1] }}>Сохранить</div>
                </label>
                : null}

        </main>
    )
}