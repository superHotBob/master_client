import styles from './client.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
const url = 'https://masters-client.onrender.com'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}






export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { slug } = router.query
    const profile = useSelector((state) => state.counter.profile)
    const [data, setData] = useState([])






    useEffect(() => {
        const  GetId = async () => {
          const data = await  fetch(`/api/get_saved_image?nikname=${slug}`)
            .then(res => res.json())
            .then(res => res)

           data.forEach(i => {
            fetch(`/api/get_image_id?id=${i}`)
                .then(res => res.json())
                .then(res => setData(data=>[...data,...res]))
            
           });
                
            

           
        }

        GetId()


    }, [slug])


    function GoToMaster(a) {
        
        router.push(`/${a}`)
    }
    function Loaded(a) {
        document.getElementById(a).style.opacity = 1
    }
    function Delete_image(a) {
        let pro = JSON.parse(localStorage.getItem('profile'))
        let new_saved = [...pro.saved_image]
        const del_image = new_saved.filter(i => i !== a)

        fetch('/api/saves_image', {
            body: JSON.stringify({ image: del_image, nikname: pro.nikname }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res => {
            const new_profile = { ...profile, saved_image: del_image }
            localStorage.setItem('profile', JSON.stringify(new_profile))
            document.getElementById(a).style.opacity = 0

        })
    }

    return (
        <>
            <Header text={profile.nikname} sel="back" />
            <div className={styles.profile}>
                <img src={ process.env.url + 'var/data/' + slug + '/main.jpg'} alt="client" height={50} />
                <h2>{profile.name}</h2> 
                <p>{profile.text}</p>
            </div>
            <div className={styles.selector}>
                <Link href={`/clientprofile/${slug}`} style={sel}>Сохранённое</Link>
                <Link href={`/clientprofile/${slug}/orders`}>Заказы</Link>
            </div>
            {/* <div className={styles.message} >
                        Здесь будут храниться ваши сохраненные работы <br />
                        мастеров, что бы не терять понравившееся из виду. <br />
                        Хотите что-то присмотреть?
                    </div> */}
            <div className={styles.images}>
                <section>
                    {data?.filter((i, index) => index % 2 === 0).map(i =>
                        <div key={i.id} id={i.id}>
                            <img
                                title={i.nikname}
                                onClick={(e) => GoToMaster(i.nikname)}
                                alt="image"
                                onLoad={() => Loaded(i.id)}
                                src={process.env.url + 'var/data/' + i.nikname + '/' + i.id + '.jpg' }
                            />
                            <span
                                className={styles.save__image}
                                onClick={() => Delete_image(i.id)}
                                title="удалить"
                            />
                        </div>
                    )}
                </section>
                <section>
                    {data?.filter((i, index) => index % 2 !== 0).map(i =>
                        <div key={i.id} id={i.id}>
                            <img
                                title={i.nikname}
                                onClick={(e) => GoToMaster(i.nikname)}
                                alt="image"
                                src={process.env.url + 'var/data/' + i.nikname + '/' + i.id + '.jpg' }
                                onLoad={() => Loaded(i.id)}
                            />
                            <span
                                className={styles.save__image}
                                onClick={() => Delete_image(i.id)}
                                title="удалить"
                            />
                        </div>
                    )}
                </section>
            </div>
            {/* <Link href="/masternear" className={styles.uslugi}>Мастера рядом</Link> */}



        </>
    )
}