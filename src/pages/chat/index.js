import Header from '@/components/header'
import styles from './chat.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

export default function Chat() {
    const router = useRouter()
    const name = useSelector(state => state.counter.profile['nikname'])
    const status = useSelector(state => state.counter.profile['status'])
    const { data, error } = useSWR(`/api/get_messages?nikname=${name}&status=${status}`, { refreshInterval: 30000 })

   
    
    
    if (error) return router.push('/')

    const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    function My_Date(a) {        
        const message_date = new Date(+a)
        const current_date = new Date()
        if (message_date.getDate() === current_date.getDate()) {
            return message_date.toLocaleDateString('ru-RU', options).slice(-5)
        }
        return message_date.toLocaleDateString('ru-RU', options)
    }   
    return (
        <>
            <Header sel="/" text="Чаты" />
            <section>
                {data?.admin.map(i =>
                    <Link
                        href={`/chat/messages/администратор?chat=${i.chat}`}
                        key={i.recipient}
                        className={styles.chat}
                    >
                        <img src="/image/администратор.jpg" alt="master" />
                        <div>
                            <p>
                                <b>Администратор</b>
                                <span>{My_Date(i.ms_date)}</span>
                            </p>
                            <span className={i.read  ? null :  i.sendler_nikname === name ? null : styles.new_message }>
                                {i.ms_text}
                            </span>
                        </div>
                    </Link>
                )}
                {data?.admin.length === 0 ? <Link href='/chat/messages/администратор' className={styles.chat}>
                    <img src="/image/администратор.jpg" alt="master" />
                    <div>
                        <p><b>Администратор</b><span>{'12:33'}</span></p>
                        <span>Отвечу на любые вопросы</span>
                    </div>
                </Link> : null}
                <div>
                    {data?.client.map(i =>
                        <Link
                            href={'/chat/messages/' + (i.sendler_nikname === name ? i.recipient_nikname : i.sendler_nikname) + '?name=' + (i.sendler_nikname === name  ? i.recipient : i.sendler)}
                            key={i.recipient}
                            className={styles.chat}
                        >
                            <Image width={55} height={55}
                            src={process.env.url_image + (i.sendler_nikname === name ? i.recipient_nikname : i.sendler_nikname) + '.jpg'} 
                            alt="master" 
                            />
                            <div>
                                <p>
                                    <b>{i.sendler_nikname === name ? i.recipient : i.sendler}</b>
                                    <span>{My_Date(i.ms_date)}</span>
                                </p>
                                <h6 className={i.read  ? null :  i.sendler_nikname === name ? null:  styles.new_message }>
                                    {i.ms_text}
                                </h6>
                            </div>
                        </Link>
                    )}
                </div>
            </section>
        </>
    )
}

