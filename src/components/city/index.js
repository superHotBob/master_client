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
            <div>
                <h1>
                   Мастера маникюра, бровей, макияжа, педикюра, причёски, массажа,
                   окрашивания, стрижки в Белоруси. 
                </h1>
                <h2>
                    Найти мастера  маникюра, бровей, макияжа, педикюра, причёски, массажа
                    очень легко и быстро с нашим сервисом.
                </h2>
                <p>Найти мастера по маникюрю, бровям, макияжу, педикюру, причёске, массажу,
                    окрашиванию, стрижке, чистке, ресницам и выбрать из них лучших 
                    городе {mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}
                    очень легко и быстро с нашим сервисом.
                </p>
            </div>

            <span>{mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}</span>
        </Link>
    )
}