import styles from './addservice.module.css'
import { useSelector } from 'react-redux'
import arrow from '../../../public/arrow_back.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu'


const style = {
    color: '#fff',   
    backgroundColor: '#3D4EEA',    
    border: '1.5px solid #3D4EEA',    
   
}
const my_services = ['Маникюр', 'Прически','Педикюр', 'Макияж', 'Массаж', 'Барбер', 'Ресницы', 'Брови', 'Депиляция']
export default function AddService() {

    const cost = useRef()
    const serv = useRef()
    const router = useRouter()
    const [profile, setProfile] = useState()
    const [viewFilter, setViewFilter] = useState(false)
    const [category, addCategory] = useState([])
    const [services, setServices] = useState()

    useEffect(()=>{
        let pro = JSON.parse(localStorage.getItem("profile"))
        setProfile(pro)
        GetServices(pro.nikname)
    },[])

   
        async function GetServices(a) {
            const response = await fetch(`/api/master_service?nikname=${a}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // The method is POST because we are sending data.
                method: 'get',
            })           
            const result = await response.json()           
            let new_serv = Object.entries(result[0])           
            setServices(new_serv)
            console.log('This is all servises',new_serv)
            let all_category = new_serv.map(i=> i[1] && i[1].length>0 ? i[0] : null)
            console.log(all_category)
            addCategory(all_category)
        }       
       
  

    const SaveServices = async () => {
        const data = {           
            nikname: profile.nikname,
            массаж: `{${services[3][1]}}`,
            педикюр: `{${services[4][1]}}`,
            маникюр: `{${services[0][1]}}`,
            прически: `{${services[7][1]}}`,
        }
        const response = await fetch('/api/edit_master_service', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
        const result = await response.json()
        console.log('Save result',result)
      
    }
    function AddCategory(e) {
        if(category.includes((e.target.id).toLowerCase())){
            let newArray = category.filter(i=>i !== (e.target.id).toLowerCase())
            addCategory(newArray)
            let new_serv = services;
            const ind = services.findIndex(i=>i[0] === (e.target.id).toLowerCase())
            new_serv[ind][1] = ''
            setServices(services)
            console.log(services)

        } else {
            addCategory(category=>([...category,(e.target.id.toLowerCase())]))
            console.log([...category,(e.target.id.toLowerCase())])
            const ind = services.findIndex(i=>i[0] === (e.target.id).toLowerCase())
            console.log(ind)
            let new_serv = services;
            new_serv[ind][1] = ['']
            setServices(services)
            console.log(services)
        }       
       
    }
    function AddService(a) {
        let new_service = services
        new_service[a][1].push('')
        setServices([...services])

    }
    function SaveNewService(a,index) {
        console.log(cost.current.value,serv.current.value,a)
        let new_service = services
        new_service[a][1][index] = `${serv.current.value}:${cost.current.value}`
        setServices([...new_service])
        console.log(new_service)
    }
    function DeleteService(a,b){
        console.log(a,b)
        let new_service = services
        new_service[a][1].splice(b,1)
        setServices(new_service)
        console.log(services)
        setServices([...services])
    }
    function DeleteNewService(a){
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
        <main className={styles.main}>
            {profile ?
            <header className={styles.header}>                
                <span  onClick={()=>router.back()}>
                     <Menu_icon type="arrow" color={profile.color[1]} />
                </span>
               
                <h4>Добавить услугу</h4>
                <span onClick={SaveServices} style={{color:profile.color[1]}}>Сохранить</span>
            </header>: null}
            <button className={styles.button} style={{color:profile?.color[1]}} onClick={()=>setViewFilter(true)}>
                <span>+</span>Добавить(удалить) категорию услуг
            </button>
            {/* <button className={styles.button} style={{backgroundColor:profile?.color[2]}}>
                <span>+</span> Добавить услугу
            </button> */}
            {/* {category.map(i=><h4 key={i} className={styles.category}>{i}</h4>)} */}
            {viewFilter ? <div className={styles.all__filter}>
                <h6 onClick={() => setViewFilter(false)}/>
                {my_services ? <div className={styles.all__filter__data} onClick={AddCategory}>
                    {my_services.map(i =><b key={i} id={i} style={category.includes(i.toLowerCase()) ? style : null}>{i}</b>)}
                </div>:null}
            </div> : null}
            {services?<>
            {services.map((i,b) => 
                <div className={styles.data} key={i[0]}>                
                    {i[1] && i[1].length>0 ? <h3 onClick={()=>AddService(b)} id={i} className={styles.type} style={{color:profile.color[1]}}>{i[0]} +</h3>:null}
                    {Array.isArray(i[1]) ? <>
                        {i[1].map((a,index)=>
                        <div key={index} style={{background: profile.color[2]}} >
                            {a.length === 0 ? 
                            <h5 className={styles.inputs}>
                                <input ref={serv} type="text" placeholder='ваша услуга'/> 
                                <input ref={cost} type="text" placeholder='стоимость' />  
                                <span onClick={()=>SaveNewService(b,index)}>+</span>
                                <span style={{color:profile.color[1]}} onClick={()=>DeleteNewService(b)}>x</span>
                            </h5>
                            :<>
                            {a.split(',').map((s,index)=>                        
                            <h5 className={styles.service} key={index} >
                                <span style={{color:profile.color[1]}}>{s.split(':')[0]}</span>
                                <span style={{color:profile.color[1]}} onClick={()=>DeleteService(b,index)}>del</span>
                                <span style={{color:profile.color[1]}}>{s.split(':')[1]} BYN</span>
                               
                            </h5>)}
                            </>
                            }
                        </div>)}
                    </>
                    :null
                }
               
                </div>
            )}</>:null}

        </main>
    )
}