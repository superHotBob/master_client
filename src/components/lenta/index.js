import FilterServices from '../filterServices'
import styles from './lenta.module.css'
import Link from 'next/link'
import Image from 'next/image'
import arrow_down from '../../../public/arrow_down.svg'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
const text = (` Ищу модель, что бы протестировать китайскую 
    косметику на юнном теле. 
    Есть вероятность, что она низкого качества. 
    От вас потребуется только придти, и посидеть часов 10-15, 
    пока я перепробую все возможные комбинации использования косметики.

    От вас:
    Возраст больше 50ти лет
    Желание терпеть
    Высокий болевой порог
    Подпись о неразглошении
    Возможность самостоятельно убраться из помещения в случае экстренной ситуации

    От меня:
    Низкокачественная косметика в подарок
    10-15 часов незабываемых процидур
    Чайок-мурёк
    Некомпетентность
    Низкокачественный сервис
    Отсутствие ответсвенности за возможные осложнения в процессе процедур

    Пишите, девачки :*:*:*:*`)

const url = 'https://masters-client.onrender.com/'
export default function Lenta({color={},nikname}) {
    
    const [model, setViewText] = useState(false)
   
   
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error, isLoading } = useSWR(`${url}getlists?dir=${nikname}`, fetcher)
   
    return (
        <main className={styles.main}>          
            <div onClick={() => setViewText(true)} className={styles.model} style={{background: color[0]}}>
                <h3>Нужна модель</h3>
                <h6>15 сентября, бесплатно</h6>
            </div>
            <div className={styles.images}>
                <div className={styles.part_images}>
                    {data?.filter((i, index) => index % 2 === 0).map(i =>                       
                        <img key={i} alt={i} src={url + 'var/data/' + nikname + '/' + i} />                        
                    )}
                </div>
                <div className={styles.part_images}>
                    {data?.filter((i, index) => index % 2 !==0).map(i =>                        
                        <img key={i} alt={i} src={url + 'var/data/' + nikname + '/' + i}  />                       
                    )}
                </div>
            </div>
            {model ? <div className={styles.need_model_main}>
                <div className={styles.need_model_data}>
                    <Image alt="arrow" src={arrow_down} height={20} width={20} onClick={() => setViewText(false)} />
                    <p className={styles.save}><span>Сохранить</span><span>12.03.2021</span></p>
                    <h4>Нужна модель бесплатно</h4>
                    <h4 className={styles.date}>11 Сертября 12:00</h4>
                    <p className={styles.text}>
                        {text}
                    </p>
                    <Link href="/" className={styles.add}>Подать заявку</Link>

                </div>

            </div> : null}

        </main>
    )
}