import {Footer} from "antd/lib/layout/layout";
import styles from './layout.module.scss'
import {useRouter} from "next/router";

export const DesktopFooter = () => {
    const router = useRouter()
    return <Footer className={`${styles['app-footer']} ${styles.desktop}`}>

    </Footer>
}
