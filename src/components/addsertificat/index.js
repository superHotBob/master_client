import { useEffect, useState } from 'react'
import Menu_icon from '../icons/menu'
import styles from './addsert.module.css'
const url = 'https://masters-client.onrender.com'
const url_loc = 'http://localhost:5000'
export default function AddSertificat({ nikname, view, color }) {
    const [sertificats, setserificats] = useState()
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
        sertificats.filter(i=>i !==a)

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
                <span style={{color:color[1]}}>Отправить</span>
            </header>
            <form className={styles.main__form}>
            <label className={styles.sertificat__upload} style={{color: color[1], backgroundColor: color[2] }}>
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
                    <div key={i} className={styles.sertificats} style={{ backgroundImage: "url(" + url + "/var/data/" + nikname + '/' + i }} >
                        <span style={{color:color[1],backgroundColor:color[2]}} onClick={()=>DeleteSertif(i)}>
                           <img src='/trash.svg' height={24} width={24} alt="trash" />
                        </span>
                    </div>)}

            </form>

        </main>
    )
}