import styles from './sertificats.module.css'
import { useState, useEffect } from 'react'

const url = 'https://masters-client.onrender.com'
export default function Sertificats({nikname}) { 
    const [sertificats, setserificats] = useState()
    useEffect(()=>{
        async function GetSertificats( ) {
            fetch(`${url}/getsertificats?dir=${nikname}`)
            .then(res=>res.json())
            .then(res=>setserificats(res))
        }
        GetSertificats()
    },[])
    return (
        <main className={styles.main}>
            {sertificats?.map(i => 
                <div 
                    key={i} 
                    className={styles.image} 
                    style={{ backgroundImage: "url(" + url + '/var/data/' +  nikname + '/' + i + ")" }}
                />
            )}
        </main>
    )
}