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
                <h1>Лучшие мастера маникюра, бровей, макияжа, педикюра, причёски, массажа,
                    окрашивания, стрижки и многого другого в городах Белоруси и России. 
                </h1>
                <p>Сделать маникюр, брови, макияж, педикюр, причёску, массаж,
                    окрашивание, стрижку и многоге другое в
                    городе {mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}
                    очень легко и быстро с нашим сервисом.
                </p>
            </div>

            <span>{mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}</span>
        </Link>
    )
}