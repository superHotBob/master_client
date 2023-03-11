import styles from './client.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Navi from '@/components/navi'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect, useLayoutEffect, useState } from 'react'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}

export default function Client() {
    const router = useRouter()
    const { pid } = router.query
    const client = useSelector((state) => state.counter.client)
    const [selector, setSelector] = useState(true)
    useEffect(() => client ? console.log('Bob') : ()=> router.push('/enter') ,[])
    return (
        <main className={styles.main}>
            <Header text={pid} />
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Сохранённое</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>Заказы</span>
            </div>
            <div className={styles.message} >
                Здесь будут храниться ваши сохраненные работы <br />
                мастеров, что бы не терять понравившееся из виду. <br />
                Хотите что-то присмотреть?
            </div>
            <Link href="/masternear" className={styles.uslugi}>
                Мастера рядом
            </Link>
            <Navi page={pid} />

        </main>
    )
}