import Header from '@/components/header'
import Navi from '@/components/navi'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './enter.module.css'

export default function Enter() {
    return (
        <div className={styles.main}>
            <Header text="Вход" sel="/" />
            <section className={styles.section}>
                <div className={styles.inputs}>
                    <p>Используйте свой номер телефона как логин для входа на сайт.</p>
                    <span>номер телефона</span>
                    <input type="tel" pattern="[\+()]*(?:\d[\s\-\.()xX]*){10,14}"
                        required />
                    <button>Войти</button>
                    <h4>
                        Нажмая на кнопку, вы соглашаетесь с<br />
                        <b style={{ color: "#3D4EEA" }}>Условиями обработки персональных <br />
                            данных  и Пользовательским соглашением</b>
                    </h4>
                </div>


            </section>


        </div>
    )
}