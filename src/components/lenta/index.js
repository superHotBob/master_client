import FilterServices from '../filterServices'
import styles from './lenta.module.css'
import Link from 'next/link'
import Image from 'next/image'
import arrow_down from '../../../public/arrow_down.svg'
import { useEffect, useState } from 'react'
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
const my_images = ['/image/lenta2.jpg', '/image/lenta1.jpg', '/image/lenta1.jpg', '/image/lenta2.jpg']
export default function Lenta({color={}}) {
    const [width, setWidth] = useState()
    const [model, setViewText] = useState(false)
    useEffect(() => setWidth(window.innerWidth > 500 ? 500 : window.innerWidth),[])
    return (
        <main className={styles.main}>
            {/* <FilterServices /> */}
            <p style={{margin: 20}}></p>
            <div onClick={() => setViewText(true)} className={styles.model} style={{background: color[0] }}>
                <h3>Нужна модель</h3>
                <p>15 сентября, бесплатно</p>
            </div>
            {width ? <div className={styles.images}>
                <div className={styles.part_images}>
                    {my_images.filter((i, index) => index % 2 ? i : null).map((i, index) =>
                        <button key={i} id={index} style={{ height: index % 2 ? width / 1.6 : width / 4 }}>
                            <Image alt={i} src={i} fill />
                        </button>
                    )}
                </div>
                <div className={styles.part_images}>
                    {my_images.filter((i, index) => index % 2 ? null : i).map((i, index) =>
                        <button key={i} style={{ height: index % 2 ? width / 4 : width / 1.6 }}>
                            <Image alt={i} src={i} fill />
                        </button>
                    )}
                </div>

            </div> : null}
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