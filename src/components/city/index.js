import styles from "./city.module.css" 
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { setstate } from "@/reduser"


export default function CitySelect({city}) {
    const dispatch = useDispatch()
    const router = useRouter()

    function handleClick() {
       dispatch(setstate(''))
       router.push("/states")
    }
    return <button className={styles.city}  onClick={handleClick}> 
        <span>{city?.charAt(0).toUpperCase() + city?.slice(1)}</span>
    </button>
   
}