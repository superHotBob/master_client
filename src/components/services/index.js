import styles from './services.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
 

export default function Services({color}) {  
    const router = useRouter()
    const { pid } = router.query
    const [services, setServices] = useState()    
    useEffect(() => {
        async function GetServices() {
            const response = await fetch(`/api/master_service?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // The method is POST because we are sending data.
                method: 'get',
            })           
            const result = await response.json()           
            let new_serv = Object.entries(result[0])           
            setServices(new_serv)
        }       
        GetServices()
    }, [])
    return (<>      
            {services?<>
            {services.map((i) => 
                <div className={styles.data} key={i[0]}>                
                    {i[1] && i[1].length>0 ?<h3 className={styles.type} style={{color:color[1]}}>{i[0]}</h3>:null}
                    {i[1] ? <>
                    {i[1].map((a,index)=><div key={index} style={{background: color[2]}}>
                        {a.split(',').map((s,index)=><h5 className={styles.service} key={index}>
                        <span style={{color:color[1]}}>{s.split(':')[0]}</span>
                        <span style={{color:color[1]}}>{s.split(':')[1]} BYN</span>
                        </h5>)}
                    </div>)}</>:null}
               
                </div>
            )}</>:null}
        </>
    )
}