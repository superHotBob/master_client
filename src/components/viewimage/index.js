import styles from './viewimage.module.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import icon_close from '../../../public/close.svg'

export default function ViewImage({ view_image, viewImage, pid = null, service }) {


    const status = useSelector(state => state.counter.profile['status'])


    useEffect(() => {
        document.getElementById("main").style.top = window.scrollY + 'px'
        document.getElementById("main").style.opacity = 1

    }, [])

    function ConvertDate(a) {
        const date = new Date(+a);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    }

    return (
        <div className={styles.main__detail} id="main">
            <div className={styles.detail}>
                <Image
                    className={styles.close}
                    src={icon_close}
                    onClick={() => viewImage(false)} alt="close" width={20} height={20}
                />
                <img
                    alt="image"
                    src={view_image.image}
                    width="100%"
                    id={view_image.image}
                    height="auto"
                />
                <div className={styles.master} >
                    <Image alt="image" src={'https://masters.place/images/' + view_image.name + '.jpg'} width={26} height={26} />
                    <span>{pid || view_image.master_name}</span>
                    <span>{ConvertDate(+view_image.date)}</span>
                </div>
                {pid ? null : <h5>{service}</h5>}
                <h6>{view_image.text}</h6>
                {pid ?
                    <Link
                        style={{ display: status === 'client' ? 'block' : 'none' }}
                        className={styles.toprofilemaster}
                        href={`/chat/messages/${view_image.name}?name=${view_image.master_name}`}
                    >
                        Отправить сообщение мастеру
                    </Link> :
                    <Link className={styles.toprofilemaster} href={'/' + view_image.name} >Перейти в профиль мастера</Link>
                }
            </div>
        </div>
    )

}