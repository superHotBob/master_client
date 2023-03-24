import styles from './addservice.module.css'
import { useSelector } from 'react-redux'


export default function AddService() {
    const profile = useSelector(state=>state.counter.profile)
    return (
        <main className={styles.main}>

        </main>
    )
}