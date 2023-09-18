import styles from './services.module.css'
import useSWR from 'swr'

export default function Services({ color, name, view}) {     
    const { data, error, isLoading } = useSWR(`/api/master_service?nikname=${name}&view=${view}`)  

    if (error) return <div>ошибка загрузки</div>
    if (isLoading) return <h3 className={styles.upload__message}>Загрузка услуг...</h3>
    if(data.length) {
        return <>
        {Object.entries(data[0]).map(i => i[1]?.length > 0 ? i[0] : null).filter(i => i)?.map((i) =>
            <div className={styles.data} key={i}>
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
    
}