import { useState, useRef } from 'react'
import Menu_icon from '../icons/menu'
import styles from './addsert.module.css'
import useSWR, { useSWRConfig } from 'swr'

const active_button = {
    color: "#fff",
    borderRadius: "4px",
    fontWeight: 500
}

export default function AddSertificat({ nikname, view, color }) {
    const [active, setactive] = useState({})
    const [message, setmessage] = useState()
    const my_ref = useRef(null)
    const { mutate } = useSWRConfig()

    const { data: sertificats } = useSWR(`/api/get_sertificats?nikname=${nikname}`)

    
    function deleteSertif(e) {
        e.stopPropagation()
        fetch(`/api/delete_images?id=${e.target.id}`)
            .then(res => res.text())
            .then(res => {
                setmessage('Сертификат удалён')
                mutate(`/api/get_sertificats?nikname=${nikname}`)
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }
  
    function SaveTagSertificate() {
        console.log(active)
        fetch('/api/add_review_publication', {
            body: JSON.stringify({
                id: active.id,
                review: my_ref.current.value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
            .then(res => {
                setmessage('Коментарий сохранён')
                mutate(`/api/get_sertificats?nikname=${nikname}`)
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }
    async function selectUpload(e) {
        // e.preventDefault()
        if (!e.target.files[0]) return
        const prof = JSON.parse(localStorage.getItem('profile'))
        let id = await fetch('/api/add_image', {
            body: JSON.stringify({
                nikname: prof.nikname,
                service: 'sertificat',
                city: prof.city,
                master_name: prof.name
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        })
            .then(res => res.json())
            .then(res => res)
        let data = new FormData()
        let file_name = id + '.jpg'
        data.append('file', e.target.files[0], file_name)
        fetch(`http://masters.place:5000/upl?name=${nikname}`,
            {
                body: data,
                method: 'post',
                headers: {
                    'Authorization': 'master'
                }
            })
            .then(res => {               
                setmessage('Сертификат отправлен на модерацию')
                mutate(`/api/get_sertificats?nikname=${nikname}`)
                setTimeout(() => setmessage(''), 2000)
            })
            .catch(err => console.log(err))
    }

    function SetForTag(i) {
        setactive(i)
        my_ref.current.value = i.review
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
                        style={{
                            border: active.review === i.review ? `4px solid ${color[1]}` : null,
                            backgroundImage: "url(" + process.env.url_image + i.id + '.jpg'
                        }}
                    >
                        <span onClick={() => SetForTag(i)} title="Добавить комментарий">
                            <img
                                src='/trash.svg'
                                height={24}
                                title="удалить сертификат"
                                width={24}
                                id={i.id}
                                alt="trash"
                                onClick={deleteSertif}
                            />
                        </span>
                    </div>
                )}

            </form>
            <label className={styles.addtag}>
                {active ?
                    <>
                        Расскажите о сертификате подробнее...
                        <textarea
                            ref={my_ref}
                            maxLength="500"
                            placeholder='Ваш комментарий'
                            rows={10}
                           
                           
                            style={{ borderColor: color[1] }}
                        />
                        <div onClick={SaveTagSertificate} style={{ ...active_button, backgroundColor: color[1] }}>
                            Сохранить
                        </div>
                    </> : 'Выберите сертификат для добавления комментария'}
            </label>


        </main>
    )
}