import styles from './succesfull.module.css'
import Link from 'next/link'
import useRouter  from 'next/router'
import { useEffect } from 'react'
export default function Succes() {
    const router = useRouter
    useEffect(()=>{
        const set = setTimeout(()=>router.push('/'),5000)
        return ()=>clearTimeout.set;
    },[router])
    return (

    <main className={styles.main}>       
        <h1>УСПЕШНО!</h1>
        <h5>
        Отлично! Вы зарегистрировали аккаунт на <br/> платформе masters.place, теперь вам <br/> доступен весь функционал.
        </h5>
        <Link href="/" >На главную</Link>        
    </main> 
    ) 
}  