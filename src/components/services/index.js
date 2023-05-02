import styles from './services.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
 

export default function Services({color}) {  
    const router = useRouter()
    const { pid } = router.query
    const [services, setServices] = useState()
    const [message, setMessage] = useState('One moument')
    const [category, setCategory] = useState()    
    useEffect(() => {
        // const category = JSON.parse(localStorage.getItem('profile'))
        // setCategory(category.services)
        async function GetServices() {
            const response = await fetch(`/api/master_service?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },                
                method: 'get',
            })           
            const result = await response.json() 
            console.log(result[0])
            if ( result.length > 0) {
                let new_serv = result[0]  
                let new_category = Object.entries(result[0]).map(i=>i[1]?.length > 0 ? i[0]:null).filter(i=>i)  
                setCategory(new_category)     
                setServices(new_serv)                
                setMessage('У вас пока нет услуг')
            }  else {

            }        
           
        }       
        GetServices()
    }, [])
    return (<>      
            {services?<>
            {category?.map((i) => 
                <div className={styles.data} key={i}>                
                    <h3 className={styles.type} style={{color:color[1]}}>{i}</h3>                    
                    {services[i]?.map((a,index)=>
                        <div key={index} style={{background: color[2],borderRadius: 4}}>
                            {a.split(',').map((s,index)=><h5 className={styles.service} key={index}>
                            <span style={{color:color[1]}}>{s.split(':')[0]}</span>
                            <span style={{color:color[1]}}>{s.split(':')[1]} BYN</span>
                            </h5>)}
                        </div>
                    )}               
                </div>
            )}</>:<h3 className={styles.no_services} style={{color:color[1]}}>{message}</h3>}
        </>
    )
}