import {Layout, Menu, MenuProps} from "antd";
import styles from './layout.module.scss';
import {useEffect, useState} from "react";
import ActiveLink from "../../lib/utility/active-link";
import {Applications} from "../../lib/utility";

const {Sider} = Layout;

const SideBarItems = [
    ...Applications,
    {
        name: 'Locations',
        key: '/locations'
    },
    {
        name: 'Schools',
        key: '/schools'
    },
    {
        name: 'Grade Assessments',
        key: '/grade-assessments'
    },
];


export const DesktopSidebar = () => {
    const [menuItems, setMenuItems] = useState([] as any[]);
    useEffect(() => {
        setMenuItems(SideBarItems.map((item) => {
            return <Menu.Item key={item.key}>
                <ActiveLink activeClassName={'active'} href={item.key}>
                    <a>
                        {item.name}
                    </a>
                </ActiveLink>
            </Menu.Item>
        }))
    }, [])
    return <Sider className={styles.sidebar}>
        <div className={styles.logo}>
            SAMARTH ADMIN
        </div>
        <Menu
            mode="inline"
            defaultSelectedKeys={['esamvaad']}
            style={{flexGrow: 1,}}
        >
            {menuItems}
        </Menu>
    </Sider>
}
