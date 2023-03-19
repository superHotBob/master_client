import Header from '@/components/header'
import styles from './editprofile.module.css'
import { useSelector } from 'react-redux'

export default function EditProfile() {
    const profile = useSelector(state=>state.counter.profile)
    return (
        <main className={styles.main}>
            <Header sel={"/client/" + profile.nikname } text={profile.nikname} />

        </main>
    )
}