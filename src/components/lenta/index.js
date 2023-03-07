import FilterServices from '../filterServices'
import styles from './lenta.module.css'

export default function Lenta() {
    return (
        <main className={styles.main}>
            <FilterServices />
        </main>
    )
}