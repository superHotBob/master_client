import styles from './client.module.css'
import { useRouter } from 'next/router'

import Header from '@/components/header'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'
import Link from 'next/link'

const url = 'https://masters-client.onrender.com'
const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}




const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { slug } = router.query
    const profile = useSelector((state) => state.counter.profile)
    
    const [data, setData] = useState([])
   



    

    useEffect(() => {
        if (slug) {
            fetch(`/api/get_saved_image?nikname=${slug}`)
            .then(res => res.json())
            .then(res => setData(res))

        } else { router.push('/') }
    }, [slug])

   
    function GoToMaster(e, a) {
        let master = a.slice(0, a.indexOf('/'))
        router.push(`/master/${master}`)
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
        <main className={styles.main}>
            <Header text={profile.nikname} sel="back" />
            <div className={styles.profile} style={{ backgroundImage: "url(" + process.env.url + '/var/data/' + profile.nikname + '/main.jpg)' ? "url(" + url + '/var/data/' + profile.nikname + '/main.jpg)' : "url(/camera_bl.svg" }}>
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
                        <div key={i} id={i}>
                            <img 
                                title={i.slice(0, i.indexOf('/'))} 
                                onClick={(e) => GoToMaster(e, i)} 
                                alt="image" src={process.envurl + '/var/data/' + i}
                                onLoad={()=>Loaded(i)} 
                            />
                            <span
                                className={styles.save__image}
                                onClick={() => Delete_image(i)}
                            />
                        </div>
                    )}
                </section>
                <section>
                    {data?.filter((i, index) => index % 2 !== 0).map(i =>
                        <div key={i} id={i}>
                            <img 
                                title={i.slice(0, i.indexOf('/'))} 
                                onClick={(e) => GoToMaster(e, i)} 
                                alt="image" 
                                src={process.env.url + '/var/data/' + i} 
                                onLoad={()=>Loaded(i)} 
                            />
                            <span
                                className={styles.save__image}
                                onClick={() => Delete_image(i)}
                            />
                        </div>
                    )}
                </section>
            </div>
            {/* <Link href="/masternear" className={styles.uslugi}>Мастера рядом</Link> */}



        </main>
    )
}