import styles from './sertificats.module.css'

const images = ['/image/sertificat1.jpg',
    '/image/sertificat2.jpg',
    '/image/sertificat3.jpg',
    '/image/sertificat4.jpg'
]

export default function Sertificats() {
    return (
        <main className={styles.main}>
            {images.map(i => <div key={i} className={styles.image} style={{ backgroundImage: `url(${i})` }}>

            </div>)}

        </main>
    )
}