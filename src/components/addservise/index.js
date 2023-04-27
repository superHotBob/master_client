import styles from './addservice.module.css'
import React from 'react'
import { useSelector } from 'react-redux'
import arrow from '../../../public/arrow_back.svg'
import trash from '../../../public/trash.svg'
import trash_blk from '../../../public/trash_blk.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu'


const style_one = {
    color: '#fff',
    background: '#8B95F2',
    border: '1.5px solid #8B95F2',
}
const style_two = {
    color: '#fff',
    background: '#3D4EEA',
    border: '1.5px solid #3D4EEA',
}
const my_category = ['маникюр', 'прически', 'педикюр', 'макияж', 'массаж', 'барбер', 'ресницы', 'брови', 'депиляция']

export default function AddService({ view, setView, color }) {
    const cost = useRef(null)
    const serv = useRef(null)
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
    const [addUsluga, setaddUsluga] = useState([])
    const [new_category, add_new_category] = useState([])
    const [category, addCategory] = useState([])
    const [services, setServices] = useState()
    const [message, viewMessage] = useState('')

    useEffect(() => {
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
        GetServices(pro.nikname, pro)
    }, [])


    async function GetServices(a, b) {
        const response = await fetch(`/api/master_service?nikname=${a}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        const result = await response.json()
        console.log('Services', result)
        if (result.length > 0) {
            let new_serv = Object.entries(result[0])
            console.log(result[0])
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
            массаж: services[3][1],
            педикюр: services[4][1],
            маникюр: services[0][1],
            брови: services[1][1],
            стрижка: services[2][1],
            ресницы: services[5][1],
            депиляция: services[6][1],
            прически: services[7][1],
            макияж: services[8][1],
        }
        console.log(data)
        profile.services = category
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
        if (category.includes(e.target.id)) {
            // let newArray = category.filter(i => i !== e.target.id)
            // addCategory(newArray)
            // let new_serv = services;
            // const ind = services.findIndex(i => i[0] === e.target.id)
            // new_serv[ind][1] = ''
            // setServices(services)
            // console.log(services)

        } else {
            // add_new_category(new_category => ([...new_category, e.target.id]))
            // console.log([...new_category, e.target.id])
            const ind = services.findIndex(i => i[0] === e.target.id)
            let new_serv = services
            new_serv[ind][1] = ['']
            setServices(services)
            addCategory(category=>([...category,e.target.id]))
            console.log(services)
        }
    }
    function AddService(a) {
        let new_service = services
        new_service[a][1].push('')
        setServices([...new_service])
    }
    function SetAddUsluga(a) {
        setaddUsluga([a])
        console.log(addUsluga)
    }
    function SaveNewService(a, b) {       
        let new_services = services       
        new_services[b][1] = [...new_services[b][1], `${serv.current.value}:${cost.current.value}`].filter(i=>i)        // // setServices([...services])
        setServices([...services])
        setaddUsluga(false)       
    }
    function DeleteService(a, b, c) {
        console.log(a, b,c)
        let new_service = services
        new_service[a][1].splice(b, 1)
        console.log( new_service[a][1])
        if(new_service[a][1].splice(b, 1).length === 0) {
            let new_cat = category.filter(i => i !==c)      
            addCategory([...new_cat])
        }       
        setServices([...services])
    }   
    function DeleteCat(del_category) {        
        const ind = services.findIndex(i=>i[0] === del_category)       
        let new_serv = services;
        new_serv[ind][1] = []       
        setServices([...new_serv])
        let new_cat = category.filter(i => i !==del_category)      
        addCategory([...new_cat])       
    }
    return (
        <main className={view ? styles.mainservice : styles.mainnew}>
            {profile ?
                <header className={styles.header}>
                    <Menu_icon type="arrow_button" color={color[1]} setView={setView} />
                    <h4 onClick={() => setView(true)}>Добавить услугу</h4>
                    <span onClick={SaveServices} style={{ color: color[11] }}>Сохранить</span>
                </header> : null}
            <div className={styles.button}>
                <span onClick={() => setViewFilter(true)}>Добавить  категорию +</span>
                <div className={styles.all__filter} style={{ display: viewFilter ? 'block' : 'none' }}>
                    <div className={styles.all__filter__data} onClick={AddCategory}>
                        {my_category?.map(cat =>
                            <b key={cat} id={cat}
                                style={category.includes(cat) ? style_one : new_category.includes(cat) ? style_two : null}
                            >
                                {cat}
                            </b>)}
                    </div>
                    <p onClick={() => setViewFilter(!viewFilter)}>Выбрать</p>
                </div>
            </div>
            {services?.map((i, b) =>
                <div className={styles.data} key={i[0]} style={{display: i[1].length > 0 ? 'block': 'none' }}>
                    {i[1] && i[1].length > 0 ?
                        <h3                            
                            id={i}
                            className={styles.type}
                            style={{ color: color[51] }}
                        >
                            {i[0]}  <Image src={trash} width={26} height={26} alt="trash" onClick={() => DeleteCat(i[0])}/>
                        </h3> : null
                    }
                    
                        {i[1].map((services, c) =>
                            <React.Fragment key={c}>
                                {services.split(',').map((service, index) =>
                                    <h5 className={styles.service} key={index} style={{ display: service.length > 0 ?'flex' : 'none' }}>
                                        <span style={{ color: color[11] }}>{service.split(':')[0]}</span>
                                        <span style={{ color: color[11] }}>{service.split(':')[1]} BYN</span>
                                        <Image src={trash_blk} width={29} height={29} alt="trash" onClick={() => DeleteService(b,c,i[0])} />

                                    </h5>
                                )}
                            </React.Fragment>
                        )}             
                        <div className={styles.button_add}>
                            <p onClick={() => SetAddUsluga(i[0])}>Добавить услугу +</p>
                            {addUsluga[0] === i[0] ?
                                <h5 className={styles.inputs__new__services} >
                                    <input ref={serv} type="text" maxLength={30} placeholder='Название услуги' />
                                    <input ref={cost} type="text" placeholder='Цена' pattern="[0-9]*"  inputMode='numeric' required/>
                                    <b>{profile.currency}</b>
                                    <span
                                        style={{ color: color[11] }}
                                        onClick={() => SaveNewService(i, b)}>
                                        Добавить
                                    </span>                                   
                                </h5>
                                :
                                null
                            }
                        </div>

                   

                </div>
            )}
            {message ? <p className={styles.message}>{message}</p> : null}

        </main>
    )
}