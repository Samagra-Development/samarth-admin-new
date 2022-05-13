import {Button, Col, Row, Tag,} from "antd";
import {Header} from "antd/lib/layout/layout";
import styles from './layout.module.scss'
import {useEffect, useState} from "react";
import {CurrentRole} from "../../lib/utility";
import {useLogin} from "../../lib/api/hooks/users/useLogin";

export const DesktopHeader = () => {
    const {logout} = useLogin();
    return <Header className={`${styles['app-header']} ${styles.desktop}`}>
        <Row justify="space-between">
            <Col flex={'auto'}>
                <Button
                    onClick={logout}
                >Logout</Button>
            </Col>
            <Col>

            </Col>
        </Row>
    </Header>
}
