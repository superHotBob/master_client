import styles from "./city.module.css" 
import { useRouter } from "next/router"
import { useSelector } from "react-redux"



export default function CitySelect() {
   
    const { mystate } = useSelector(state => state.counter)
    const router = useRouter()

    function handleClick() {    
       router.push("/states")
    }
    return <button className={styles.city}  onClick={handleClick}> 
        <span>{mystate?.charAt(0).toUpperCase() + mystate?.slice(1)}</span>
    </button>
   
}