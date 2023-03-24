import styles from './addservice.module.css'
import { useSelector } from 'react-redux'
import arrow from '../../../public/arrow_back.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


const style = {
    color: '#fff',   
    backgroundColor: '#3D4EEA',    
    border: '1.5px solid #3D4EEA',    
   
}
const services = ['Маникюр', 'Прически','Педикюр', 'Макияж', 'Массаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция']
export default function AddService() {
  
    const router = useRouter()
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
    const [category, addCategory] = useState([])

    useEffect(()=>{
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(profile=>(pro))
       
    },[])

    const SaveServices = async () => {
        const data = {           
            nikname: profile.nikname
        }
        const response = await fetch('/api/addservices', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const result = await response.json()
      
    }
    function AddCategory(e) {
        if(category.includes(e.target.id)){
            let newArray = category.filter(i=>i!==e.target.id)
            addCategory(newArray)

        } else {
            addCategory(category=>([...category,e.target.id]))
            console.log([...category,e.target.id])
        }       
       
    }
    return (
        <main className={styles.main}>
            {profile ?
            <header className={styles.header}>
                <Image src={arrow} alt="back"  onClick={()=>router.back()} />
                <h4>Добавить услугу</h4>
                <span onClick={SaveServices} style={{color:profile.color[1]}}>Сохранить</span>
            </header>: null}
            <button className={styles.button} style={{color:profile?.color[1]}} onClick={()=>setViewFilter(true)}>
                <span>+</span>Добавить категорию услуг
            </button>
            <button className={styles.button} style={{backgroundColor:profile?.color[2]}}>
                <span>+</span> Добавить услугу
            </button>
            {category.map(i=><h4 key={i} className={styles.category}>{i}</h4>)}
            {viewFilter ? <div className={styles.all__filter}>
                <h6 onClick={() => setViewFilter(false)}/>
                {services ? <div className={styles.all__filter__data} onClick={AddCategory}>
                    {services.map(i =><b key={i} id={i} style={category.includes(i) ? style : null}>{i}</b>)}
                </div>:null}
            </div> : null}

        </main>
    )
}