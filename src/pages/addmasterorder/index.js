import styles from './addmasterorder.module.css'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useEffect , useState} from 'react'
import arrow from '../../../public/arrow_back.svg'
import { useRouter } from 'next/router'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)

export default function AddMasterOrder() {
    const profile = useSelector(state => state.counter.profile)
    const router = useRouter()
    const [date, handleDateChange] = useState(new Date());
    useEffect(() => {
        profile?.status === 'master' ? '' : router.push('/')
    }, [])
    return (
        <main>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                <span>Добавить запись</span>
                <span>Закрыть</span>
            </header>
            <section className={styles.main}>
                <p>Клиент</p>
                <div className={styles.client}>
                    <h4>Bob</h4>
                </div>
                <p>Дата и время</p>
                <span>Выберите дату записи и время.</span>
                <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="p"
                    timeIntervals={60}
                    
                    dateFormat="Pp"
                    locale="ru"
                    
                />
                <p>Услуги и стоимость</p>
                <span>Выберите предоставляемые услуги клиенту. Вы можете<br/>
                 скоректировать стоимость индивидуально для заказа.
                 </span>
                <p>{date.getDay()}</p>
            </section>
        </main>
    )
}