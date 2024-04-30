import Link from 'next/link'
import styles from './catalog/catalog.module.css'
import { category } from '@/data.'
import Information from '@/components/information'
import CitySelect from '@/components/city'
import Head from 'next/head'


export default function Catalog() {   
    return (
        <>
            <Head>
                <title>Маникюр, педикюр, стрижка, прическа и др. в вашем городе</title>  
            </Head>  
            <CitySelect />      
            <section className={styles.section}>               
                <Link href="/event" className={styles.model}>
                    СТАНЬ МOДЕЛЬЮ БЕCПЛАТНO
                </Link>
                <Link href="/become" className={styles.master}>
                    СТАНЬ МАСТЕРОМ
                </Link>
                <div className={styles.images}>
                    {category.map(i =>
                        <Link href={`/masternear/${i}`} key={i}>
                            <img title={i}  id={i} alt={i} src={'/' + i + '.svg'} width="80" height='90' />
                        </Link>                        
                    )}
                </div>
                <Link href="/catalog/services" className={styles.uslugi}>
                    Все услуги
                </Link>
                <Link href="/masternear/city" className={styles.around__masters}>
                    Мастера рядом
                </Link>
                <Information />
            </section>
        </>
    )
}