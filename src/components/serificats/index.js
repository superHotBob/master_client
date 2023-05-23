import styles from './sertificats.module.css'
import { useState, useEffect } from 'react'
import useSWR from 'swr'

const url = 'https://masters-client.onrender.com'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Sertificats({nikname}) { 
    const { data, error, isLoading } = useSWR(`${url}/getsertificats?dir=${nikname}`, fetcher)
    if (error) return <div>ошибка загрузки</div>
    if (isLoading) return <div>загрузка...</div>
   
    return (
        <main className={styles.main}>
            {data?.map(i => 
                <div 
                    key={i} 
                    className={styles.image} 
                    style={{ backgroundImage: "url(" + url + '/var/data/' +  nikname + '/' + i + ")" }}
                />
            )}
        </main>
    )
}