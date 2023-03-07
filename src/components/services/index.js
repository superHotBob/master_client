import Image from 'next/image'
import { useState } from 'react'
import styles from './services.module.css'
import star from '../../../public/star-small.svg'
const services = [{
    type: 'Маникюр', items: [
        { service: 'Аппаратный маникюр', price: '1000', currenсy: '₽' },
        { service: 'Маникюр + покрытие однотон', price: '5000', currenсy: '₽' },
        { service: 'Маникюр + покрытие + френч/укрепление гелем', price: '1500', currenсy: '₽' },
        { service: 'Снятие покрытия', price: '1000', currenсy: '₽' },
        { service: 'Дизайн 1 ноготь', price: '1200', currenсy: '₽' }]

}]

export default function Services(props) {
    const [view, setView] = useState(true)
    return (
        <main className={styles.main}>
            {services.map(i => <div className={styles.data} key={i.type}>
                <h3 className={styles.type}>{i.type}</h3>
                {i.items.map(a => <p className={styles.service} key={a.service}>
                    <span>{a.service}</span>
                    <span>{a.price} {a.currenсy}</span></p>)}

            </div>)}

        </main>
    )
}