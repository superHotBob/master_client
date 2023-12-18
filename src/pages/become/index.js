import Image from 'next/image'
import arrow from '../../../public/arrow_back_bold.svg'
import styles from './become.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function Become() {
    const router = useRouter()
    return (
        <>
            <header className={styles.header}>
                <Image src={arrow} alt="back" onClick={() => router.back()} />
                Как стать мастером?
                <button onClick={() => router.back()}>закрыть</button>
            </header>
            <section className={styles.main_section}>
                <h4>Подключение аккаунта мастера</h4>
                <p>Шаг первый. Регистрация.</p>
                <img src="https://masters.place/images/my/400.jpg" alt="main"  />
                <span>
                    Для начала нужно зарегестрироваться на платформе.
                    Сделать это можно через <b>кнопку входа</b> в нижнем меню.
                </span>
                <img src="https://masters.place/images/my/401.jpg" alt="main"  />
                <span>
                    Введите свой номер телефона, который будет логином
                    для последующих входов на платформу. Нажмите на
                    кнопку войти.
                </span>
                <img src="https://masters.place/images/my/402.jpg" alt="main"  />
                <span>
                    После нажатия на вход, на ваш номер телефона
                    позвонит системный номер телефона, последние четыре
                    цифры которого нужно будет ввести в поле для ввода и
                    нажать подтвердить.
                </span>
                <img src="https://masters.place/images/my/403.jpg" alt="main"  />
                <span>
                    Придумайте пароль и продублируйте его во второй
                    строке, нажмите завершить регистрацию!
                </span>
                <p>Шаг второй. Подключение мастера.</p>
                <img src="https://masters.place/images/my/404.jpg" alt="main"  />
                <span>
                    После завершения регистрации откройте меню в правом
                    верхнем углу, что бы активировать профиль мастера.
                </span>
                <img src="https://masters.place/images/my/405.jpg" alt="main"  />
                <span>
                    В меню профиля вы увидите пункт для подключения
                    аккаунта мастера, нажмите кнопку подключить.
                </span>
                <img src="https://masters.place/images/my/406.jpg" alt="main"  />
                <span>
                    После подключения аккаунта мастера у вас открются
                    дополнительные пункты настройки. Вы сможете
                    настроить место приема клиентов, выбрать валюту для
                    стоимости ваших услуг и унифицировать свой профиль.
                </span>
                <p>Шаг третий. Настройка профиля.</p>
                <img src="https://masters.place/images/my/407.jpg" alt="main"  />
                <span>
                    Что бы настроить место приема клиентов -
                    нажмите на “Изменить” в соотвествующем пункте.
                </span>
                <img src="https://masters.place/images/my/408.jpg" alt="main"  />
                <span>
                    После заполнения всех полей нажмити кнопку
                    в правом верхнем углу - применить,
                    что бы изменения вступили в силу.
                </span>
                <p>Настройка профиля мастера.</p>
                <span>
                    Теперь вы можете добавить свои
                    услуг и время приема на сеансы
                    на странице вашего профиля.
                </span>
                <Link href="/filling">Заполнение профиля мастера</Link>
            </section>
        </>
    )
}