import styles from './addservice.module.css'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu' 
import { my_data } from '@/data.'


const style = {
    color: '#fff',
    backgroundColor: '#3D4EEA',
    border: '1.5px solid #3D4EEA',
}


export default function AddService() {

    const cost = useRef(null)
    const serv = useRef(null)    
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
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
            headers: {'Content-Type': 'application/json'}
        })
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
        services.forEach(element => data[element[0]] = element[1]);        
        // const response = await fetch('/api/edit_master_service', {
        //     body: JSON.stringify(data),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     method: 'POST',
        // })

        // if (response) {
        //     viewMessage('Услуги добавлены')
        //     setTimeout(() => viewMessage(), 3000)
        // } else {
        //     viewMessage('Ошибка записи')
        //     setTimeout(() => viewMessage(), 3000)
        // }

    }
    function AddCategory(e) {
        if (category.includes(e.target.id)) {
            let newArray = category.filter(i => i !== e.target.id)
            addCategory(newArray)
            let new_serv = services;
            const ind = services.findIndex(i => i[0] === e.target.id)
            new_serv[ind][1] = ''
            setServices(services)     

        } else {
            addCategory(category => ([...category, e.target.id]))           
            const ind = services.findIndex(i => i[0] === e.target.id)
            let new_serv = services;
            new_serv[ind][1] = ['']
            setServices(services)

        }

    }
    function AddService(a) {
        let new_service = services
        new_service[a][1].push('')
        setServices([...new_service])

    }
    function SaveNewService(a, index) {
        // console.log(cost.current.value,serv.current.value,a)
        let new_service = services
        new_service[a][1][index] = `${serv.current.value}:${cost.current.value}`
        setServices([...new_service])
        console.log(new_service)
    }
   
    function DeleteNewService(a) {
        console.log(a)
        let new_service = services
        new_service[a][1].pop()
        setServices(new_service)
        console.log(services)
        setServices([...services])
    }
    // function DeleteCat(e) {        
    //     const ind = services.findIndex(i=>i[0] === (e.target.id.toLowerCase()).replace(',',''))
    //     console.log(e.target.id)
    //     console.log(ind)
    //     let new_serv = services;
    //     new_serv[ind][1] = ''       
    //     setServices(new_serv)
    //     addCategory(category=>([]))
    //     console.log(services)
    // }
    return (
        <main className={styles.mains}>
            {profile ?
                <header className={styles.header}>
                    <Menu_icon type="arrow" color={profile.color[1]} />
                    <h4>Добавить услугу</h4>
                    <span onClick={SaveServices} style={{ color: profile.color[1] }}>Сохранить</span>
                </header> : null}
                <button className={styles.button} onClick={() => setViewFilter(true)}>
                    <span> &#128930;</span>Добавить(удалить) категорию услуг
                </button>
                <div className={styles.all__filter} style={{ display: viewFilter ? 'block' : 'none' }}>
                    <h6 onClick={() => setViewFilter(false)} />
                    <div className={styles.all__filter__data} onClick={AddCategory}>
                        {my_data.category?.map(i => <b key={i} id={i} style={category.includes(i) ? style : null}>{i}</b>)}
                    </div>
                </div>
                {services?.map((i, b) =>
                    <div className={styles.data} key={i[0]}>
                        {i[1] && i[1].length > 0 ? <h3 onClick={() => AddService(b)} id={i} className={styles.type} style={{ color: profile.color[1] }}>
                            {i[0]}  <span style={{ color: profile.color[1] }}>&#128934;</span>
                        </h3> : null}
                        {Array.isArray(i[1]) ? <>
                            {i[1].map((a, index) =>
                                <div key={index} style={{ background: profile.color[2] }} className={styles.usluga}>
                                    {a.length === 0 ?
                                        <h5 className={styles.inputs__new__services}>
                                            <input ref={serv} type="text" maxLength={70} placeholder='Название услуги' />
                                            <input ref={cost} type="text" placeholder='Цена' />
                                            <span
                                                style={{ color: profile.color[1] }}
                                                onClick={() => SaveNewService(b, index)}>
                                                &#128934;
                                            </span>
                                            {/* <span style={{ color: profile.color[1] }} onClick={() => DeleteNewService(b)}>x</span> */}
                                        </h5>
                                        :
                                        <>
                                            {a.split(',').map((s, index) =>
                                                <h5 className={styles.service} key={index} >
                                                    <span style={{ color: profile.color[1] }}>{s.split(':')[0]}</span>
                                                    <span style={{ color: profile.color[1] }}>{s.split(':')[1]} BYN</span>
                                                    <span style={{ color: profile.color[1] }} onClick={() => DeleteNewService(b)}>&#128465;</span>
                                                </h5>
                                            )}
                                        </>
                                    }
                                </div>)}
                        </>
                            : null
                        }

                    </div>
                )}
                {message ? <p className={styles.message}>{message}</p> : null}

        </main>
    )
}