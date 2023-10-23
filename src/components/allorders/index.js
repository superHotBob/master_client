import styles from './allorders.module.css'
import Order from '@/components/order'
import useSWR from 'swr'

export default function AllOrders({ profile}) {
    const { data } = useSWR(`/api/get_orders_master_all?nikname=${profile.nikname}`)

    return (
        <section className={styles.section}>
            {data?.map(i => <Order order={i} key={i.id} profile={profile.tema} />
                )}
        </section>
    )
}