import styles from './patern.module.css'
import trash_blk from '../../../public/trash_blk.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Menu_icon from '@/components/icons/menu'
import Message from '@/components/message'
import Messages from '@/components/messages'


export default function EditPatern() {

    const [patern, setPatern] = useState()
    const [viewForm, setViewForm] = useState(false)
    const [message, setMessage] = useState('')
    const [del, setDel] = useState(false)



    useEffect(() => {
        fetch(`/api/get_patern?nikname=${JSON.parse(localStorage.getItem('profile')).nikname}`)
            .then(res => res.json())
            .then(res => setPatern(res))
    }, [])

    function DeletePatern(a) {
        let new_patern = patern.filter(i => i !== a)
        setPatern([...new_patern])
        setDel(false)
    }
    function SetPatern() {
        let one = document.getElementsByTagName('input')[0].value
        let two = document.getElementsByTagName('input')[1].value
        let three = document.getElementsByTagName('input')[2].value
        let four = document.getElementsByTagName('input')[3].value
        if (patern.includes(`${one}${two}:${three}${four}`) || patern.length === 12) {

        } else {
            setPatern(patern => ([...patern, `${one}${two}:${three}${four}`]))
            setViewForm(false)
        }
    }
    function SavePatern() {
        let pro = JSON.parse(localStorage.getItem('profile'))
        let data = {
            patern: patern,
            nikname: pro.nikname
        }
        fetch('/api/edit_patern', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then(res => res.text())
            .then((res) => {
                setMessage(res)
                setTimeout(() => setMessage(''), 3000)
            })

    }
    const handleKeyDown = (e, b) => {
        if (e.key === 'Backspace') {
            if (!e.target.value > 0 && b > 0) {
                document.getElementsByTagName('input')[b].value = ''
                document.getElementsByTagName('input')[b - 1].focus()
            }
        }
    }
    function Number(a, b, c) {
        if (b === 1) {
            if (+document.getElementsByTagName('input')[0].value === 2 && +a > 3) {
                document.getElementsByTagName('input')[b].value = ''
                return;
            }
        }
        if (!isNaN(a) && +a <= c) {
            if (a !== '' && b < 3) {
                document.getElementsByTagName('input')[b + 1].focus()
            }
        } else {
            document.getElementsByTagName('input')[b].value = ''
        }

    }
    return (
        <>
            <header className={styles.header} >
                <Menu_icon type="arrow_button" color="#000" />
                <h4>Шаблон времени</h4>
                <span onClick={SavePatern}>Сохранить</span>
            </header>
            <Message text={`Вы можете создавать и удалять до двенадцати
                 временых окон для записи.
                `}
            />
            <section className={styles.paterns}>
                {patern?.sort().map((i, index) =>
                    <div key={i}>
                        {i}
                        {index ? <Image src={trash_blk} width={29} height={29} alt="trash" onClick={() => setDel(i)} /> : null}
                        {del === i ? <span className={styles.delete} onClick={() => DeletePatern(i)}>Удалить</span> : null}
                    </div>)}
                {patern?.length < 12 ? <div className={styles.add}>
                    <b>Добавить</b>
                    <b onClick={() => setViewForm(true)}>+</b>
                </div> : null}
                {Array.from({ length: 11 - patern?.length }, (v, i) => '').map((i, index) =>
                    <div key={index} />
                )}
            </section>
            {viewForm ?
                <div className={styles.time}>

                    <input
                        type="text"
                        autoFocus
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                        pattern="[0-2]*"
                        inputMode='numeric'
                        required
                        maxLength={1}
                        onChange={(e) => Number(e.target.value, 0, 2)}
                    />
                    <input
                        type="text"
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                        pattern="[0-9]*"
                        inputMode='numeric'
                        required maxLength={1} onChange={(e) => Number(e.target.value, 1, 9)}
                    />
                    <b>:</b>
                    <input
                        type="text"
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                        pattern="[0-5]*"
                        inputMode='numeric'
                        required maxLength={1} onChange={(e) => Number(e.target.value, 2, 5)}
                    />
                    <input
                        type="text"
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                        pattern="[0-9]*"
                        inputMode='numeric'
                        required maxLength={1} onChange={(e) => Number(e.target.value, 3, 9)}
                    />

                    <div onClick={SetPatern}>
                        Добавить время для записей
                    </div>
                </div>
                : null}


            {message ? <Messages text={message} close={setMessage} /> : null}
        </>
    )
}