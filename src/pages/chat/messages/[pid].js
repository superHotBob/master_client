import Header from "@/components/header"
import { useRouter } from "next/router"
import styles from './messages.module.css'

export default function Messages() {
    const router = useRouter()
    const {pid} = router.query
    return (
        <main className={styles.main}>
            <Header sel='/chat' text={pid} />

        </main>
    )
}