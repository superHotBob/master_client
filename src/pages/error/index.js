import Link from "next/link"
import { useRouter } from "next/router"
import styles from "./error.module.css"


export default function Error() {
    const router = useRouter()
    return (
        <dialog open className={styles.dialog}>
            <div>
                <span onClick={()=>router.back()}>закрыть</span>
                <h4>
                Эта функция доступна только<br/>
                зарегистрированным пользователям. Для<br/>
                продолжения войдите или зарегистрируйте<br/>
                аккаунт.
                </h4>
                <Link href="/enter">Войти</Link>
            </div>
        </dialog>
    )
}