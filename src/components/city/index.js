import Link from "next/link";
import styles from "./city.module.css"

export default function CitySelect({city}) {
    return <Link className={styles.city} href="/city">Ваш город <span>{city}</span></Link>
   
}