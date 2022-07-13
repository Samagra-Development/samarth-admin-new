import styles from '../layout.module.scss'
import {useRouter} from "next/router";
import {Button, Col, Row, Space, Typography} from "antd";

const {Title} = Typography;
export const DesktopList = ({children, addEnable, filters, title}: any) => {
    const router = useRouter()
    const {pathname, asPath} = router;
    return <div className={`${styles.desktopList}`}>
        <Row className={styles.titleBar} gutter={10}>
            <Col flex={'auto'}>
                <Title level={3}>{title}</Title>
            </Col>
            {
                filters?.length && <>
                    {
                        filters.map((f: any, index: number) => {
                            return <Col key={index}>
                                {f}
                            </Col>
                        })
                    }
                </>
            }
            {
                addEnable && <Col>
                    <Button onClick={() => router.push(asPath + '/create')}>
                        Add New
                    </Button>
                </Col>
            }
        </Row>
        {
            children
        }
    </div>
}
