import styles from './services.module.css'
const services = [
    {id: 1, type: 'Маникюр', service: 'Аппаратный маникюр', price: '1000', currenсy: '₽' },
    {id: 12, type: 'Маникюр', service: 'Маникюр + покрытие однотон', price: '5000', currenсy: '₽' },
    {id: 14, type: 'Маникюр', service: 'Маникюр + покрытие + френч/укрепление гелем', price: '1500', currenсy: '₽' },
    {id: 15, type: 'Маникюр', service: 'Снятие покрытия', price: '1000', currenсy: '₽' },
    {id: 2, type: 'Маникюр', service: 'Дизайн 1 ноготь', price: '1200', currenсy: '₽' },
    {id: 5, type: 'Педикюр', service: 'Аппаратный педикюр', price: '1000', currenсy: '₽' },
    {id: 9, type: 'Педикюр', service: 'педикюр + покрытие однотон', price: '5000', currenсy: '₽' },
    {id: 8, type: 'Педикюр', service: 'педикюр + покрытие + френч/укрепление гелем', price: '1500', currenсy: '₽' },
    {id: 7, type: 'Педикюр', service: 'Снятие покрытия', price: '1000', currenсy: '₽' },
    {id: 6, type: 'Педикюр', service: 'Дизайн 1 ноготь', price: '1200', currenсy: '₽' },
]



export default function Services(props) {   
    return (
        <main className={styles.main}>
            {services.map((i,index) => <div className={styles.data} key={i.id}>
                {services[index-1] ? <>
                {services[index-1].type!==services[index].type ? <h3 className={styles.type}>{i.type}</h3>:null}</>:<h3 className={styles.type}>{i.type}</h3>}
                <p className={styles.service} >
                    <span>{i.service}</span>
                    <span>{i.price} {i.currenсy}</span>
                </p>
            </div>)}
        </main>
    )
}