import Image from 'next/image'
import arrow from '../../../public/arrow_back_bold.svg'
import styles from '../become/become.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function AddPublications() {
    const router = useRouter()
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                Заполнение профиля
                <button onClick={() => router.back()}>закрыть</button>
            </header>
            <section className={styles.main_section}>
                <h4>Публикация работ</h4>
                <p>Добавление публикаций ваших работ</p>
                <img src="https://masters.place/images/my/448.jpg" alt="main"  />
                <span>
                В профиле нажмите на соответствующую кнопку, что бы перейти в окно добавления публикаций.
                </span>
                <img src="https://masters.place/images/my/449.jpg" alt="main"  />
                <span>
                Нажмите на большой квадрат с плюсом, что бы выбрать фотографию с вашего устройства.
                </span>
                <img src="https://masters.place/images/my/450.jpg" alt="main"  />
                <span>Вы сможете выбрать категорию, что бы вашу работу было проще найти клиентам на 
                    главной странице при сортировке. Добавьте описание вашей работы.</span>
                <img src="https://masters.place/images/my/451.jpg" alt="main"  />
                <span>
                Добавив фотографию, описание и категорию можно публиковать вашу работу. 
                Для этого есть соответствующая кнопка.
                </span>
               
                
            </section>
        </>
    )
}