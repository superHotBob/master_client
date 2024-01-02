import Header from '@/components/header'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import styles from './confirmation.module.css'
import { Collaboration } from '../recordingtomaster'
import { useState } from 'react'
import { useEffect } from 'react'
import { months } from '@/profile'


export default function Confirmation() {
    const router = useRouter()
    const { order, master, profile, date_order: date_order } = useSelector(state => state.counter)
   
    const [goodorder, setgoodorder] = useState(false)
    const [address_master, setaddress] = useState()

    const { data } = useSWR(`/api/get_full_address?nikname=${master.nikname}`)



    
   
   
    const SaveOrder = () => {              
        const month_order =  months.lastIndexOf(date_order.split(',')[1])
        const year = date_order.split(',')[3]       
        if(profile.status === 'client') {
            const data = {
                client_nikname: profile.nikname ,
                client_name:  profile.name,
                master_nikname: master.nikname,
                master_name: master.name,
                price: Cost(order),
                order: order.join(','),
                myorder: order,
                date: date_order,
                address:  address_master,
                month: month_order ,
                year: year
            }           
            fetch('/api/save_order', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }).then(res=>{
                setgoodorder(true)
                EditSchedule(master.nikname)
            })
           
        } else {
            const data = {
                client_nikname: profile.nikname ,
                client_name:  profile.name,
                master: profile.nikname,
                master_name: profile.name,
                price: Cost(order),
                order: order.join(','),
                date: date_order,
                address:  address_master,
                month: month_order,
                year: year
            }
            fetch('/api/save_order_master', {
                method: 'POST',               
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res=>{
                setgoodorder(true)
                EditSchedule(profile.nikname)
            })
            
        }
        
    }


    async function EditSchedule(a) {
        const my_data = {
            nikname: a,
            month: date_order.split(',')[1].toLowerCase(),
            year: date_order.split(',')[3]            
        } 
        await  fetch(`/api/get_schedule?nikname=${a}&month=${my_data.month}&year=${my_data.year}`)
        .then(res => res.json())
        .then(data =>{
            let new_schedule = data;
            let new_days = new_schedule[date_order.split(',')[0]-1].split(',').filter(i=>i!=date_order.split(',')[2]);           
            new_schedule[date_order.split(',')[0] - 1] = new_days.join();
            my_data['schedule'] = new_schedule;
            
        }) 
       
        fetch('/api/edit_schedule', {
            body: JSON.stringify(my_data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        .then(res => console.log('Ok'))

    }

    useEffect(()=>{       
        setaddress('Ул. ' +  master.address  + ', дом ' + 
        data?.full_address?.дом + ', кв.' + data?.full_address?.квартира  + ', этаж ' + 
        data?.full_address?.этаж)
    },[])
    
    function World(a) {
        if (a > 1 && a < 5) {
            return 'услуги'
        } else if (a === 1) {
            return 'услуга'
        } else {
            return 'услуг'
        }
    }

   

    function Cost() {
        if (order.length > 0) {
            let cost = order.map(i => +i.split('~')[1])
            let sum = cost.reduce((i, a) => a + i)
            return sum
        } else {
            () => router.push('/')
        }
    }
       
    function Order_Date(a) { 
        if(a) {           
            let d = a.split(',')      
            const tm = d[2].split(':')                        
            const date_ord = new Date(d[3],months.indexOf(d[1]) - 1 , d[0], tm[0],tm[1])            
            const formattedDate = date_ord.toLocaleDateString('ru-RU', 
            { month: 'long', day: 'numeric', hour:   '2-digit', minute: '2-digit' })
            return formattedDate
        } else {
            return 
        }  
    }
    
    return (
        <>
            <Header sel="back" text="Подтверждение заказа" />
            <section className={styles.order}>
                <h3>Ваш заказ
                    {order.length ?
                        <span className={styles.world_for_count}>{order.length} {World(order.length)}</span>
                        : null}
                </h3>
                <h4>Услуги:</h4>
                {order?.map((i,index) =>
                    <p className={styles.uslugi} key={index}>
                        <span>{i.split('~')[0]}</span><span>{i.split('~')[1]} {data?.currency}</span>
                   
                    {i.split('~')[2]}
                    </p>
                )}
                <h4>Адрес:</h4>
                <span className={styles.street}>{master.address}</span>, кв {data?.address_full.квартира}  этаж {data?.address_full.этаж}
                <h4>Дата: </h4>
                <span className={styles.date}>{Order_Date(date_order)}</span>
                <h3>Сумма</h3>
                <p className={styles.summa}>
                    <span>Услуги и товары ({order.length})</span>
                    <span>{Cost()} {data?.currency}</span>
                </p>
              
               
                <h3>Общая стоимость<span>{Cost(order)} {data?.currency}</span></h3>
                <div onClick={SaveOrder}>Записаться</div>
                <Collaboration />
                {goodorder ? <div className={styles.goodorder}>
                    <h3>masters.place</h3>
                    <h1>УСПЕШНО!</h1>
                    <h4>Заказ создан, свяжитесь с мастером, что-бы <br /> не потерять друг-друга.</h4>
                    <Link href={`/chat/messages/${master.nikname}?name=${master.name}`}>Открыть чат с мастером</Link>
                    <h6 onClick={() => router.push(`/${master.nikname}`)}>Закрыть</h6>
                </div> : null}
            </section>
        </>
    )
}