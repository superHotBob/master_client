import styles from './messages.module.css'
export default function Messages({phone, name}) {
    return (
        <article className={styles.main_message}>
           <p>Имя : {name}</p>
           <p>Телефон: {phone} </p>
        </article>
    )
}