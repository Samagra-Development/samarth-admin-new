import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {Button, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../lib/api/hooks/users/useLogin";
import {ApplicationId} from "./application";
import {Permissions} from "../../components/role-access";
import {useUsers} from "../../lib/api/hooks/users/useUsers";
import {DesktopList} from "../../components/layouts/list/desktop.list";

const {Text} = Typography;
const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const {asPath} = router;
    const applicationId = ApplicationId;
    const {user, logout} = useLogin();
    const level = user?.user?.data?.roleData?.geographic_level;
    const permissions = Permissions[level]?.schools;
    const {users, pageSize, currentPage, total, refresh, isLoading} = useUsers(applicationId, {
        numberOfResults: 10,
        page: 1
    });
    const columns = [
        {
            title: 'UDISE',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'District',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Block',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        },
        {
            title: 'Session',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        },
        {
            title: 'Active State',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        },
        // {
        //     title: 'Type',
        //     key: 'roles',
        //     render: (a: any) => {
        //         const registration = a.registrations?.find((r: any) => r.applicationId === applicationId);
        //         if (!registration) {
        //             return <Text>-</Text>
        //         }
        //         const {roles} = registration;
        //         return roles.map((role: any, index: number) => {
        //             return <Tag style={{marginBottom: '5px'}} key={index}>{role}</Tag>
        //         })
        //     }
        // },


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
        <DesktopList title={application?.name} addEnable={permissions?.canCreate}>
            <Table loading={isLoading} dataSource={users} columns={columns} pagination={{
                current: currentPage, total: total,
                onChange: (page) => {
                    refresh(applicationId, {page})
                },
                pageSize: pageSize
            }}/>
        </DesktopList>
    )
}

export default UsersList
