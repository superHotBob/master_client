import styles from './client.module.css'
import { useRouter } from 'next/router'
import Header from '@/components/header'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setorder } from '@/reduser'

const sel = {
    background: 'linear-gradient(90deg, #3D4EEA 0%, #5E2AF0 100%)',
    fontWeight: 600,
    color: '#fff'
}


const orders = [{active: 1,name: 'Вика Цыганова', nikname:'victoria1245',cost: 2500, date: '17 Сентября в 17: 00',number: 4588, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
{active: 0,name: 'Клава Шниперсон', nikname:'klava1245',cost: 2500, date: '17 Сентября в 17: 00',number: 4587, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
{active: 0,name: 'Эльвира', nikname:'Super1245',cost: 2500, date: '17 Сентября в 17: 00',number: 4589, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'}]

export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const  pid  = router.query.order  
    const profile = useSelector((state) => state.counter.profile)
    const [selector, setSelector] = useState(!pid)
    useEffect(() => profile.status ? console.log('Bob') : () => router.push('/enter'), [])

    function viewOrder(a,b) {
        dispatch(setorder(orders[a]))
        router.push('/order/' + b)
    }
    return (
        <main className={styles.main}>
            <Header text={profile.nikname} />
            <div className={styles.profile} style={{ backgroundImage: "url(/camera_bl.svg" }}>
                <h2>{profile.username}</h2>
                <Link href="/editprofile">Редактировать профиль</Link>

            </div>
            <div className={styles.selector}>
                <span onClick={() => setSelector(1)} style={selector ? sel : null}>Сохранённое</span>
                <span onClick={() => setSelector(0)} style={selector ? null : sel}>Заказы</span>
            </div>
            {selector ? <>
                {/* <div className={styles.message} >
                    Здесь будут храниться ваши сохраненные работы <br />
                    мастеров, что бы не терять понравившееся из виду. <br />
                    Хотите что-то присмотреть?
                </div> */}
                <div className={styles.images}>
                    {['one', 'two', 'three', 'four', 'five'].map((i, index) =>
                        <div key={i} style={{ backgroundImage: `url(/image/${i}.jpg)` }} />)}
                </div>
                <Link href="/masternear" className={styles.uslugi}>
                    Мастера рядом
                </Link></>
                : <>
                    {/* <div className={styles.message} >
                        Здесь будет храниться история ваши заказы.
                    </div> */}
                    {orders.map((i,index)=>
                        <div 
                            onClick={()=>viewOrder(index,i.number)}
                            key={i.number} 
                            className={styles.order}    
                        >
                            <p><span className={i.active?styles.active:null}>{i.date}</span><span>#{i.number}</span></p>
                            <h3><span>{i.name}</span><span>{i.cost} ₽</span></h3>
                            <h6>{i.text}</h6>
                        </div>
                    )}

                </>}           

        </main>
    )
}