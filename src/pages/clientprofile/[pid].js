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


const orders = [
    {active: 1,master: 'Вика Цыганова', nikname:'Mercedec',cost: 4500, date: '17 Сентября в 17: 00',order: 4588, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
    {active: 0,master: 'Клава Шниперсон', nikname:'RedBull',cost: 2500, date: '17 Сентября в 17: 00',order: 4587, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'},
    {active: 0,master: 'Эльвира', nikname:'Super1245',cost: 5800, date: '17 Сентября в 17: 00',order: 4589, text:'Маникюр, педикюр, пилинг, шмилинг, чай + тортик, пирожки домашние, прическа.'}
]

export default function Client() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { pid }   = router.query  
    const profile = useSelector((state) => state.counter.profile)   
    const [selector, setSelector] = useState(!pid)
    const [orders, setOrders] = useState([])
    useEffect(() => profile.status ? console.log('Bob') : () => router.push('/'), [profile.status,router])
    useEffect(() => {        
        async function GetMaster() {
            const response = await fetch(`/api/get_orders_client?nikname=${pid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },                
                method: 'get',
            })           
            const result = await response.json() 
            setOrders(result)
            console.log(result)       
        }
        GetMaster()
    }, [])
    function viewOrder(a,b) {
        dispatch(setorder(orders[a]))
        router.push('/order/' + b)
    }
    return (
        <main className={styles.main}>
            <Header text={profile.nikname} />
            <div className={styles.profile} style={{ backgroundImage: profile.image ? `url(${profile.image})` :"url(/camera_bl.svg" }}>
                <h2>{profile.name}</h2>
                <p>{profile.text}</p>
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
                    {['one', 'two', 'three', 'four', 'five'].map(i =>
                        <div key={i} style={{ backgroundImage: `url(/image/${i}.jpg)` }} />)}
                </div>
                <Link href="/masternear" className={styles.uslugi}>Мастера рядом</Link>
                    
                </>
                : <>
                    
                    {orders?.map((i,index)=>
                        <div 
                            onClick={()=>viewOrder(index,i.order)}
                            key={i.order} 
                            className={styles.order}    
                        >
                            <p><span className={i.active?styles.active:null}>{i.date_order.replace(',', " ").replace(',', " в ") + ':00'}</span><span>#{i.id}</span></p>
                            <h3><span>{i.master}</span><span>{i.price} BYN</span></h3>
                            <h6>{i.neworder.split(',').map((i,index)=><span key={index}>{(i.split(':')[0] + (index > 0 ? '':' , '))}</span>)}</h6>
                        </div>
                    )}
                </>
            }                      

        </main>
    )
}