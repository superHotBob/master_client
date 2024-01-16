import Image from 'next/image'
import arrow from '../../../public/arrow_back_bold.svg'
import styles from '../become/become.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function FillingProfile() {
    const router = useRouter()
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                Заполнение профиля
                <button onClick={() => router.back()}>закрыть</button>
            </header>
            <section className={styles.main_section}>
                <h4>Заполнение профиля мастера</h4>
                <p>Добавление услуг</p>
                <img src="https://masters.place/images/my/410.jpg" alt="main"  />
                <span>
                В профиле нажмите на соответствующую кнопку, что бы перейти в окно настройки.
                </span>
                <img src="https://masters.place/images/my/411.jpg" alt="main"  />
                <span>
                Выберите категорию. У вас появится возможность добавить услугу в выбранную категорию.
                </span>
                <img src="https://masters.place/images/my/412.jpg" alt="main"  />
                <span>Заполните разделы и нажмите кнопку добавить.</span>
                <img src="https://masters.place/images/my/413.jpg" alt="main"  />
                <span>
                В каждой категории вы можете добавить множество услуг, которые можете предоставить клиентам.
                </span>
               
                <img src="https://masters.place/images/my/414.jpg" alt="main"  />
               
                <img src="https://masters.place/images/my/415.jpg" alt="main"  />
                <span>
                Готово. Теперь клиент сможет увидеть список услуг и записаться на сеанс.
                </span>               
                <p>Настройка календаря работы</p>
                <img src="https://masters.place/images/my/416.jpg" alt="main"  />
                <span>
                Откройте меню и выберите соответствующий пункт.
                </span>
                <img src="https://masters.place/images/my/417.jpg" alt="main"  />
                <span>
                Выбирайте месяц и день, когда у вас есть окно для записи. 
                Что бы создать онко для записей к вам, выберите время. 
                Макрер над днем отобразит количество окон на этот день. 
                Что бы добавить в шаблон новое время для записи, 
                нажмите на соответствующую кнопку.
                </span>
                <img src="https://masters.place/images/my/418.jpg" alt="main"  />
                <span>
                Добавьте новый шаблон времени, что бы иметь возможность 
                выбирать его при создании окон для записи.
                Нажмите сохранить для примерения настроек.
                <br/>
                <br/>
                Что бы применить настройки календаря работ сохраните 
                примененные изменения в колендаре в правом верхнем углу.
                </span>
                <Link href="/addpublications">Публикация работ</Link>
            </section>
        </>
    )
}