import  styles  from './patern.module.css'
import trash from '../../../public/trash.svg'
import trash_blk from '../../../public/trash_blk.svg'
import Image from 'next/image'

import { useEffect, useState, useRef } from 'react'
import Menu_icon from '@/components/icons/menu'
import Message from '../message'


export default function EditPatern({view,color,setView,old_patern,nikname}) {
    const [patern, setPatern] = useState()
    const [viewForm, setViewForm] = useState(false)
    const [message, setMessage] = useState(false)
    const [del, setDel] = useState(false)

    useEffect(()=>setPatern([...old_patern]),[])

    function DeletePatern(a) {
        let new_patern =  patern.filter(i=>i!==a)
        setPatern([...new_patern])
        setDel(false)       
    }
    function SetPatern() {
        let one = document.getElementsByTagName('input')[0].value
        let two = document.getElementsByTagName('input')[1].value
        let three = document.getElementsByTagName('input')[2].value
        let four = document.getElementsByTagName('input')[3].value        
        if(patern.includes(`${one}${two}:${three}${four}`) || patern.length === 12) {

        } else {
            setPatern(patern=>([...patern,`${one}${two}:${three}${four}`]))
            setViewForm(false)
        }
    }
    function SavePatern() {        
        let data = {
            patern: patern,
            nikname: nikname
        }
        fetch('/api/edit_patern', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then(res=>{
            setMessage(true)
            setTimeout(()=>setMessage(false),3000)
        })

    }
    const handleKeyDown = (e,b) => {      
        if (e.key === 'Backspace') {       
            if (!e.target.value > 0 && b > 0) {
                document.getElementsByTagName('input')[b].value = ''
                document.getElementsByTagName('input')[b - 1].focus()
            }
        }       
    };
    function Number(a, b) {
       
       if(!isNaN(a)) {        
            if (a !=='' && b < 3) {
                    document.getElementsByTagName('input')[b + 1].focus()
            }
        } else {
            document.getElementsByTagName('input')[b].value = '' 
        }
                 
    }
    return (
        <main className={!view ? styles.mainpatern : styles.mainnew}>
            
                <header className={styles.header} style={{ color: color[1] }}>
                    <Menu_icon type="arrow_button" color={color[1]} setView={()=>setView(false)} />
                    <h4>Шаблон времени</h4>
                    <span onClick={SavePatern} >Сохранить</span>
                </header> 
                <Message text={`Вы можете создавать и удалять до двенадцати
                 временых окон для записи.
                `}
                color={color}
                />
                <dialog open={message} className={styles.message}>
                    Шаблон  сохранен
                </dialog>
                <section className={styles.paterns}>
                 {patern?.sort().map(i =>
                    <div key={i} style={{backgroundColor: color[2]}}>
                        {i} 
                        <Image src={trash_blk} width={29} height={29} alt="trash" onClick={() => setDel(i)} />
                        {del === i ? <span className={styles.delete} onClick={() => DeletePatern(i)}>Удалить</span>:null}
                    </div>)}
                    {patern?.length<12?<div style={!viewForm ? {backgroundColor: color[2]}:{backgroundColor: color[1],color: '#fff'}}>
                        <b>Добавить</b> 
                        <b onClick={()=>setViewForm(true)}>+</b>
                    </div>:null}
                    {Array.from({length: 11 - patern?.length}, (v,i)=>'').map(i=>
                        <div key={i} style={{backgroundColor: color[2]}}></div>
                    )}
                </section>
                {viewForm ? 
                    <div className={styles.time} style={{backgroundColor: color[2], color: '#000' }}>
                        <input 
                            type="text" 
                            onKeyDown={(e)=>handleKeyDown(e,0)} 
                            pattern="[0-1]*"                         
                            inputMode='numeric' 
                            required  maxLength={1}  onChange={(e) => Number(e.target.value,0)} 
                        />
                        <input 
                            type="text" 
                            onKeyDown={(e)=>handleKeyDown(e,1)} 
                            pattern="[0-9]*"                         
                            inputMode='numeric' 
                            required  maxLength={1}  onChange={(e) => Number(e.target.value,1)}  
                        />
                        <b>:</b>
                        <input 
                            type="text" 
                            onKeyDown={(e)=>handleKeyDown(e,2)} 
                            pattern="[0-9]*"                         
                            inputMode='numeric' 
                            required  maxLength={1}  onChange={(e) => Number(e.target.value,2)} 
                        />
                        <input 
                            type="text" 
                            onKeyDown={(e)=>handleKeyDown(e,3)} 
                            pattern="[0-9]*"                         
                            inputMode='numeric' 
                            required  maxLength={1}  onChange={(e) => Number(e.target.value,3)} 
                        />
                        <div style={{backgroundColor: color[1]}} onClick={SetPatern}>
                            Добавить время для записей
                        </div>
                    </div>
                : null}
               
           

        </main>
    )
}