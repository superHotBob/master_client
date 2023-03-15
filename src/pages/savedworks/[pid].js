import Header from '@/components/header'
import Navi from '@/components/navi'
import styles from './saved.module.css'
import { useRouter } from 'next/router'

export default function Saved() {
    const router = useRouter()
    const {pid} = router.query
    return (
        <main className={styles.main}>
            <Header sel={'/master/' + pid}  text="Сохраненные работы" />

            <div className={styles.images}>
            {['one', 'two', 'three', 'four', 'five'].map((i, index) =>
              <div key={i} style={{ backgroundImage: `url(/image/${i}.jpg)` }} />)}
          </div>            
        </main>
    )
}