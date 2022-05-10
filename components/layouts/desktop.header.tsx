import {Col, Row, Tag,} from "antd";
import {Header} from "antd/lib/layout/layout";
import styles from './layout.module.scss'
import {useEffect, useState} from "react";
import {CurrentRole} from "../../lib/utility";

export const DesktopHeader = () => {
    return <Header className={`${styles['app-header']} ${styles.desktop}`}>
        <Row justify="space-between">
            <Col>
                <Tag>
                    {
                        CurrentRole
                    }
                </Tag>
            </Col>
        </Row>
    </Header>
}
