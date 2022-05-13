import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DesktopList} from "../../../components/layouts/list/desktop.list";
import {useUsers} from "../../../lib/api/hooks/users/useUsers";
import {Applications} from "../../../lib/utility";
import {Button, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../../lib/api/hooks/users/useLogin";
import {Permissions} from "../../../components/role-access";
import {ApplicationId} from "../../../components/shiksha-application";
import {getLevelFromDesignation} from "../../../components/designation-level";

const {Text} = Typography;
const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const {asPath} = router;
    const applicationId = ApplicationId;
    const {user, logout} = useLogin();
    const level = user?.user?.data?.roleData?.geographic_level;
    const permissions = Permissions[level]?.applications?.[applicationId];
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
            title: 'Level',
            key: 'level',
            render: (a: any) => {
                const registration = a.registrations?.find((r: any) => r.applicationId === applicationId);
                if (!registration) {
                    return <Text>-</Text>
                }
                const designation = registration?.data?.roleData?.designation;
                return <Text>{getLevelFromDesignation(designation) || '-'}</Text>
            }
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
        if (applicationId) {
            refresh(applicationId)
            setApplication(Applications.find((a) => a.id === applicationId))
        }
    }, [applicationId])
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
