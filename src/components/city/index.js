import Link from "next/link"
import styles from "./city.module.css"
import { useSelector } from "react-redux"

export default function CitySelect() {
    const { mystate } = useSelector(state => state.counter)   
    return (
        <Link 
            className={styles.city} 
            title="Выбрать область" 
            href="/states"
        >
            <span>{mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}</span>
        </Link>
    )
}