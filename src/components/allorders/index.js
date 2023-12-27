import styles from './allorders.module.css'
import Order from '@/components/order'
import useSWR from 'swr'

export default function HistoryOrders({ profile}) {
    const { data, isLoading } = useSWR(`/api/get_orders_master_all?nikname=${profile.nikname}`)

    if(isLoading) {
        return <h3>Загрузка записей</h3>
    }

    return (
        <section className={styles.section}>
            {data?.map(i => <Order order={i} key={i.id} profile={profile.tema} />  )}
              
        </section>
    )
}