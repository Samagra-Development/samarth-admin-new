import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {Button, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../lib/api/hooks/users/useLogin";
import {ApplicationId} from "./application";
import {Permissions} from "../../components/role-access";
import {useUsers} from "../../lib/api/hooks/users/useUsers";

const {Text} = Typography;
const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const {asPath} = router;
    const applicationId = ApplicationId;
    const {user, logout} = useLogin();
    const level = user?.user?.data?.roleData?.geographic_level;
    const permissions = Permissions[level].schools;
    const {users, pageSize, currentPage, total, refresh, isLoading} = useUsers(applicationId, {
        numberOfResults: 10,
        page: 1
    });
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Mobile Phone',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        },
        {
            title: 'Roles',
            key: 'roles',
            render: (a: any) => {
                const registration = a.registrations?.find((r: any) => r.applicationId === applicationId);
                if (!registration) {
                    return <Text>-</Text>
                }
                const {roles} = registration;
                return roles.map((role: any, index: number) => {
                    return <Tag style={{marginBottom: '5px'}} key={index}>{role}</Tag>
                })
            }
        },


        {
            title: 'Actions',
            key: 'actions',
            render: (a: any) => <Space>
                {
                    permissions?.canEdit && <Button shape={"circle"}>
                        <EditFilled onClick={
                            () => {
                                router.push(`${asPath}/${a.id}/edit`)
                            }
                        }/>
                    </Button>
                }
            </Space>
        },
    ];

    useEffect(() => {
        if (user) {
            if (!permissions || !permissions.canRead) {
                logout();
            }
        }
    }, [user]);
    return (
       <></>
    )
}

export default UsersList
