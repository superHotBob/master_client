import styles from './services.module.css'
import useSWR from 'swr'

export default function Services({ color, name }) {    
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error, isLoading } = useSWR(`/api/master_service?nikname=${name}`, fetcher)
   
    // useEffect(() => {        
    //     async function GetServices() {
    //         const response = await fetch(`/api/master_service?nikname=${name}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },                
    //             method: 'get',
    //         })           
    //         const result = await response.json() 
    //         // console.log(result[0])
    //         if ( result.length > 0) {
    //             let new_serv = result[0]  
    //             let new_category = Object.entries(result[0]).map(i=>i[1]?.length > 0 ? i[0]:null).filter(i=>i)  
    //             setCategory(new_category)     
    //             setServices(new_serv)             
    //         }  else {
    //             setMessage('У вас пока нет услуг')
    //         }        

    //     }       

    //         GetServices()

    // }, [name])

    if (error) return <div>ошибка загрузки</div>
    if (isLoading) return <div className={styles.upload__message}>Загрузка услуг...</div>
    return <>
        {Object.entries(data[0]).map(i => i[1]?.length > 0 ? i[0] : null).filter(i => i)?.map((i) =>
            <div className={styles.data} key={i} style={{ color: color[1] }}>
                <h3 className={styles.type}>{i}</h3>
                {data[0][i]?.map((a, index) =>
                    <div key={index} style={{ background: color[2], borderRadius: 4, color: 'inherit' }}>
                        {a.split(',').map((s, index) => <h5 className={styles.service} key={index}>
                            <span>{s.split(':')[0]}</span>
                            <span>{s.split(':')[1]} BYN</span>
                        </h5>)}
                    </div>
                )}
            </div>
        )}

    </>
}