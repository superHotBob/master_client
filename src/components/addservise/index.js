import styles from './addservice.module.css'
import { useSelector } from 'react-redux'
import arrow from '../../../public/arrow_back.svg'
import trash from '../../../public/trash.svg'
import trash_blk from '../../../public/trash_blk.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu'


const style = {
    color: '#fff',
    background: '#8B95F2',
    border: '1.5px solid #8B95F2',

}
const my_category = ['маникюр', 'прически', 'педикюр', 'макияж', 'массаж', 'барбер', 'ресницы', 'брови', 'депиляция']

export default function AddService({ view, setView }) {
    const cost = useRef(null)
    const serv = useRef(null)
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
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
            let newArray = category.filter(i => i !== e.target.id)
            addCategory(newArray)
            let new_serv = services;
            const ind = services.findIndex(i => i[0] === e.target.id)
            new_serv[ind][1] = ''
            setServices(services)
            console.log(services)

        } else {
            add_new_category(new_category => ([...new_category, e.target.id]))
            console.log([...new_category, e.target.id])
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
    function DeleteService(a, b) {
        console.log(a, b)
        let new_service = services
        new_service[a][1].splice(b, 1)
        setServices(new_service)
        console.log(new_service)
        setServices([...services])
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
        <main className={view ? styles.mainservice : styles.mainnew}>
            {profile ?
                <header className={styles.header}>
                    <Menu_icon type="arrow_button" color={profile.color[1]} setView={setView} />
                    <h4 onClick={() => setView(true)}>Добавить услугу</h4>
                    <span onClick={SaveServices} style={{ color: profile.color[1] }}>Сохранить</span>
                </header> : null}
            <div className={styles.button} onClick={() => setViewFilter(true)}>
                Добавить  категорию +
                <div className={styles.all__filter} style={{ display: viewFilter ? 'block' : 'none' }}>
                    <div className={styles.all__filter__data} onClick={AddCategory}>
                        {my_category?.map(i => <b key={i} id={i} style={category.includes(i) ? style : null}>{i}</b>)}
                    </div>
                    <p onClick={() => setViewFilter(false)}>Выбрать</p>
                </div>
            </div>
            {services?.map((i, b) =>
                <div className={styles.data} key={i[0]}>
                    {i[1] && i[1].length > 0 ?
                        <h3
                            onClick={() => AddService(b)}
                            id={i}
                            className={styles.type}
                            style={{ color: profile.color[51] }}
                        >
                            {i[0]}  <Image src={trash} width={26} height={26} alt="trash" />
                        </h3> : null
                    }
                    {Array.isArray(i[1]) ? <>
                        {i[1].map((a, index) =>
                            <div key={index} style={{ background: profile.color[21] }} className={styles.usluga}>
                                <>
                                    {a.split(',').map((s, index) =>
                                        <h5 className={styles.service} key={index} >
                                            <span style={{ color: profile.color[11] }}>{s.split(':')[0]}</span>
                                            <span style={{ color: profile.color[11] }}>{s.split(':')[1]} BYN</span>
                                            <Image src={trash_blk} width={29} height={29} alt="trash" onClick={() => DeleteNewService(b)}/>
                                            
                                        </h5>
                                    )}
                                </>
                                <div className={styles.button}>

                               Добавить услугу +

                                    {true ?
                                        <h5 className={styles.inputs__new__services} key={index}>
                                            <input ref={serv} type="text" maxLength={30} placeholder='Название услуги' />
                                            <input ref={cost} type="text" placeholder='Цена' />
                                            <b>{profile.currency}</b>
                                            <span
                                                style={{ color: profile.color[11] }}
                                                onClick={() => SaveNewService(b, index)}>
                                                Добавить
                                            </span>
                                            {/* <span style={{ color: profile.color[1] }} onClick={() => DeleteNewService(b)}>x</span> */}
                                        </h5>
                                        :
                                        null
                                    }
                                </div>
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