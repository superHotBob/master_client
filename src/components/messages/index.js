import Image from 'next/image'
import styles from './messages.module.css'
export default function Messages({ phone,name,close, nikname,text }) {
    return (
        <section className={styles.tel_message}>
            <article className={styles.central_message}>
                <Image                   
                    src='/close.svg' 
                    height={12} 
                    width={12} 
                    alt='close'
                    onClick={()=>close('')} 
                />
                {phone ? 
                    <>
                        <Image
                            src={process.env.url_image + nikname + '.jpg'}
                            alt="menu"
                            style={{float:'none'}}
                            className={styles.image_master}
                            width={110} height={110}
                        />
                        <h3>{name}</h3>
                        <p>Номер телефона для связи</p>
                        <span>+{phone}</span>
                    </> 
                :
                <p>{text}</p>}
            </article>
        </section>
    )
}