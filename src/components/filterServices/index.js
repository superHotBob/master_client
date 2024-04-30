import styles from './filter.module.css'
import { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setservice } from '../../reduser.js'
import { category } from '@/data.'

const style = {
    color: '#fff',   
    backgroundColor: '#3D4EEA',    
    border: '1.5px solid #3D4EEA',    
   
}

export default function FilterServices() {
    const [viewFilter, setViewFilter] = useState(false)  
    const dispatch = useDispatch()
    const my_service = useSelector(state=>state.counter.service)   

    function setFilter(e) {   
        if(e.target.id) {    
            dispatch(setservice(e.target.id))
            setViewFilter(false)
        }
    }    
    return (
        <div className={styles.main__filter}>
            <h2>{my_service}</h2>
            <span onClick={() => setViewFilter(!viewFilter)}>
                фильтр по услугам
            </span>
            {viewFilter ? <div className={styles.all__filter}>              
                <div className={styles.all__filter__data} onClick={setFilter}>
                    {category.map(i =><b key={i} id={i} style={my_service === i ? style : null}>{i}</b>)}
                </div>
            </div> : null}
        </div>
    )
}