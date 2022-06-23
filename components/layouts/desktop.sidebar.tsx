import {Layout, Menu, MenuProps} from "antd";
import styles from './layout.module.scss';
import {useEffect, useState} from "react";
import ActiveLink from "../../lib/utility/active-link";
import {Applications} from "../../lib/utility";
import {useLogin} from "../../lib/api/hooks/users/useLogin";

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
const SideBarItemsTeachers = [
    {
        name: 'Teachers',
        key: '/users/teachers'
    },
];


export const DesktopSidebar = () => {
    const [menuItems, setMenuItems] = useState([] as any[]);
    const {userType} = useLogin();
    useEffect(() => {
        setMenuItems((userType === 'SCHOOL' ? SideBarItemsTeachers : SideBarItems).map((item) => {
            return <Menu.Item key={item.key}>
                <ActiveLink activeClassName={'active'} href={item.key}>
                    <a>
                        {item.name}
                    </a>
                </ActiveLink>
            </Menu.Item>
        }))
    }, [userType])
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
