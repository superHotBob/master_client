import styles from './filter.module.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setservice } from '../../reduser.js'

const style = {
    color: '#fff',
    padding: '0 10px',
    backgroundColor: '#3D4EEA',    
    border: '1.5px solid #3D4EEA',    
   
}
const services = ['Маникюр', 'Прически', 'Макияж', 'Массаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция']
export default function FilterServices({service}) {
    const [viewFilter, setViewFilter] = useState(false)
    const [filter, SetFilter] = useState()
    const dispatch = useDispatch()
    // const [services, setServices] = useState()

    // useEffect(()=>{
    //     async function Result() {
    //       const response = await(fetch('/api/all_services'))
    //       const result = await response.json()
    //       setServices([...new Set(result.map(i=>i.services).flat())])
    //     }
    //     Result()
        
    // },[])
    useEffect(()=>SetFilter(service),[service])

    function setFilter(e) {
        SetFilter(e.target.id.toLowerCase())
        dispatch(setservice(e.target.id.toLowerCase()))
    }
    
    return (
        <div className={styles.main__filter}>
            <span>{filter || 'Ноготочки,макияж,мас...'}</span>
            <span onClick={() => setViewFilter(true)}>
                фильтр по услугам
            </span>
            {viewFilter ? <div className={styles.all__filter}>
                <h6 onClick={() => setViewFilter(false)}>фильтр по услугам</h6>
                {services ? <div className={styles.all__filter__data} onClick={setFilter}>
                    {services.map(i =><b key={i} id={i} style={filter === i.toLowerCase() ? style : null}>{i}</b>)}
                </div>:null}
            </div> : null}
        </div>
    )
}