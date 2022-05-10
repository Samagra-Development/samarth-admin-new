import {Layout, Alert} from "antd";
import {Content} from "antd/lib/layout/layout";
import {DesktopHeader} from "./desktop.header";
import styles from './layout.module.scss';
import {DesktopSidebar} from "./desktop.sidebar";
import {useRouter} from "next/router";

const {ErrorBoundary} = Alert;

export const DesktopLayout = ({children}: any) => {
    const router = useRouter();
    if (router.asPath === '/login') {
        return <>
            {children}
        </>
    }
    return <Layout className={styles['app-layouts']}>
        <DesktopSidebar/>
        <Content>
            <DesktopHeader/>
            <Content className={styles.innerContent}>
                {/*@ts-ignore*/}
                <ErrorBoundary>
                    <div className={styles['site-layouts-content']}>
                        {children}
                    </div>
                </ErrorBoundary>
                {/*<DesktopFooter/>*/}
            </Content>
        </Content>
    </Layout>
}
