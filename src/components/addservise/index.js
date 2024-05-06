import styles from './addservice.module.css'
import React from 'react'
import trash from '../../../public/trash.svg'
import trash_blk from '../../../public/trash_blk.svg'
import Image from 'next/image'
import { category } from '@/data.'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu'
import Messages from '../messages'


const style_one = {
    background: '#8B95F2',
}
const style_two = {
    color: '#fff',
    background: '#3D4EEA',
}


export default function AddService({ view, setView, color }) {
    const cost = useRef(null)
    const serv = useRef(null)
    const review = useRef(null)    
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
    const [addUsluga, setaddUsluga] = useState([])
    const [new_category, add_new_category] = useState([])
    const [my_category, addCategory] = useState([])
    const [services, setServices] = useState()
    const [message, viewMessage] = useState('')

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
        GetServices(pro.nikname, pro)   
    }, [])    

    async function GetServices(a, b) {
        const response = await fetch(`/api/master_service?nikname=${a}`)
       
        const result = await response.json()       
        if (result.length > 0) {
            let new_serv = Object.entries(result[0])            
            setServices(new_serv)
            let all_category = new_serv.map(i => i[1] && i[1].length > 0 ? i[0] : null)
            addCategory(b.services ? b.services : all_category)
        } else {
            setServices([])
        }
    }

    const SaveServices = async () => {
        const data = {
            nikname: profile.nikname,
        }
        const new_category = []
        services.forEach(element => data[element[0]] = element[1]);
        services.forEach(element => element[1].length > 0 ? new_category.push(element[0]) : null)
        profile.services = new_category
        localStorage.setItem('profile', JSON.stringify(profile))
        const response = await fetch('/api/edit_master_service', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        if (response) {
            viewMessage('Услуги добавлены')
            setTimeout(() => viewMessage(), 3000)
        } else {
            viewMessage('Ошибка записи')
            setTimeout(() => viewMessage(), 3000)
        }
    }
    function AddCategory(e) {        
        if (my_category.includes(e.target.id)) {

        } else {
            // add_new_category(new_category => ([...new_category, e.target.id]))
            // console.log([...new_category, e.target.id])           
            const ind = services.findIndex(i => i[0] === e.target.id)            
            let new_serv = services
            new_serv[ind][1] = ['']
            setServices(services)
            addCategory(my_category => ([...my_category, e.target.id]))           
        }
    }
    function DeleteMessage(a, b) {
        console.log(a)
        document.getElementById(a).style.left = b
    }
    function SetAddUsluga(a) {
        setaddUsluga([a])
        
    }
    function SaveNewService(event, a, b) {
       
        event.preventDefault()
        let new_services = services
        new_services[b][1] = [...new_services[b][1], `${serv.current.value}~${cost.current.value}~${review.current.value}`]
        .filter(i => i)      
        setServices([...services])
        setaddUsluga(false)
    }
    
    function DeleteService(a, b, c, d) {
       
        let new_service = services
        new_service[a][1].splice(b, 1)
        
        // if (ss.length === 0) {
        //     let new_cat = category.filter(i => i !== c)
        //     addCategory([...new_cat])
        // }
        DeleteMessage(d + 'del', '100%' )
        setServices([...services])
    }
    function DeleteCat(del_category) {
        const ind = services.findIndex(i => i[0] === del_category)
        let new_serv = services;
        new_serv[ind][1] = []
        setServices([...new_serv])
        let new_cat = my_category.filter(i => i !== del_category)
        addCategory([...new_cat])
    }
    return (
        <div className={view ? styles.mainservice : styles.mainnew}>
            {profile ?
                <header className={styles.header}>
                    <div onClick={()=>setView(true)}>
                        <Menu_icon type="arrow_button_close" color={color[1]} />
                    </div>
                    
                    <h4 onClick={() => setView(true)}>Добавить услугу</h4>
                    <span onClick={SaveServices} style={{ color: color[1] }}>Сохранить</span>
                </header> : null}
            <div className={styles.button} style={{ color: color[2], background: color[2] }}>
                <span style={{ color: color[1], cursor: 'pointer' }} onClick={() => setViewFilter(true)}>Добавить  категорию +</span>
                <div className={styles.all__filter} style={{ display: viewFilter ? 'block' : 'none' }}>
                    <div className={styles.all__filter__data} onClick={AddCategory}>
                        {category.map(cat =>
                            <b
                                key={cat}
                                id={cat}
                                style={my_category.includes(cat) ?
                                    { ...style_one, color: color[1], backgroundColor: color[2], borderColor: color[1] } : new_category.includes(cat) ?
                                    { ...style_two, color: color[1], borderColor: color[1] } : { cursor: 'pointer', color: color[1], borderColor: color[1] }}
                            >
                                {cat}
                            </b>
                        )}
                    </div>
                    <p style={{ color: color[2], background: color[1] }} onClick={() => setViewFilter(!viewFilter)}>Выбрать</p>
                </div>
            </div>
            {services?.map((i, b) =>
                <div className={styles.data} key={i[0]} style={{ display: i[1]?.length > 0 ? 'block' : 'none' }}>
                    {i[1] && i[1].length > 0 ?                        
                        <h3
                            id={i}
                            className={styles.type}
                            style={{ color: color[2], background: color[1] }}
                        >
                            {i[0]}  <Image src={trash} width={26} height={26} alt="trash" onClick={() => DeleteMessage(i[0] + 'del', 0)} />
                            <p id={i[0] + 'del'} className={styles.delete__message}>
                                <span>Удалить категорию?</span>
                                <button onClick={() => DeleteCat(i[0])}>Удалить</button>
                                <button onClick={() => DeleteMessage(i[0] + 'del', '100%')}>Отмена</button>
                            </p>
                        </h3>: null
                    }

                    {i[1]?.map((service, c) =>
                        <React.Fragment key={c}>
                            {/* {services.split(',').map((service, index) => */}
                                <h5 className={styles.service}  style={{ display: service.length > 0 ? 'flex' : 'none' }}>
                                    <span style={{ color: color[1] }}>{service.split('~')[0]}</span>
                                    <span style={{ color: color[1] }}>{service.split('~')[1]} {profile.currency}</span>
                                    <Image src={trash_blk} width={29} height={29} alt="trash" onClick={() => DeleteMessage(service + 'del', 0)} />
                                    <p id={service + 'del'} className={styles.delete__message}>
                                        <b>Удалить услугу?</b>
                                        <button onClick={() => DeleteService(b, c, i[0],service)}>Удалить</button>
                                        <button onClick={() => DeleteMessage(service + 'del', '100%')}>Отмена</button>
                                    </p>
                                </h5>
                            {/* )} */}
                        </React.Fragment>
                    )}
                    <div className={styles.button_add} style={{ backgroundColor: color[2], color: color[1] }}>
                        <p onClick={() => SetAddUsluga(i[0])} style={{ cursor: 'pointer', color: color[1] }}>
                            Добавить услугу +
                        </p>
                        {addUsluga[0] === i[0] ?                           
                                <form onSubmit={(event) => SaveNewService(event, i, b)} className={styles.inputs__new__services} style={{color:color[1]}}>
                                <input 
                                    autoFocus 
                                    style={{ borderColor: color[1]}} 
                                    ref={serv} 
                                    type="text" 
                                    maxLength={50} 
                                    placeholder='Название услуги' 
                                />
                                <input 
                                    style={{ borderColor: color[1]}} 
                                    ref={cost} 
                                    type="text" 
                                    placeholder='Цена' 
                                    pattern="[0-9]*" 
                                    inputMode='numeric' 
                                    required 
                                />
                                <textarea 
                                    maxLength={200} 
                                    style={{ borderColor: color[1]}} 
                                    ref={review}
                                    rows={5} cols={40} 
                                    placeholder='Описание услуги до 200 символов'
                                />
                                <b style={{ color: color[1] }}>{profile.currency}</b>
                                <button type='submit'
                                    style={{backgroundColor: color[1] }}
                                   >
                                    Добавить
                                </button>

                                </form>
                                
                           
                            :
                            null
                        }
                    </div>



                </div>
            )}
            {message && <Messages close={viewMessage}  text={message}/>} 

        </div>
    )
}