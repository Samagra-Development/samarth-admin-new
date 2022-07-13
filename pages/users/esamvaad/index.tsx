import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DesktopList} from "../../../components/layouts/list/desktop.list";
import {useUsers} from "../../../lib/api/hooks/users/useUsers";
import {Applications} from "../../../lib/utility";
import {Button, Form, Input, Select, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../../lib/api/hooks/users/useLogin";
import {Permissions} from "../../../components/role-access";
import {ApplicationId} from "../../../components/esamaad-application";

const {Text} = Typography;
const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const [udise, setUDISE] = useState('' as any);
    const [role, setRole] = useState('' as any);
    const [page, setCurrentPage] = useState('' as any);
    const {asPath} = router;
    const applicationId = ApplicationId;
    const {user, logout} = useLogin();
    const level = user?.user?.data?.roleData?.geographic_level;
    const permissions = Permissions[level]?.applications?.[applicationId];
    const getApplicationQueryPart = () => `registrations.applicationId: ${applicationId}`;

    const {users, pageSize, currentPage, total, refresh, isLoading} = useUsers(applicationId, {
        numberOfResults: 10,
        queryString: `(${getApplicationQueryPart()})`,
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
            dataIndex: ['mobilePhone'],
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
                    permissions?.canEdit && <Button shape={"circle"} onClick={
                        () => {
                            router.push(`${asPath}/${a.id}/edit`)
                        }
                    }>
                        <EditFilled/>
                    </Button>
                }
            </Space>
        },
    ];

    useEffect(() => {
        const _qs = [getApplicationQueryPart()];
        setApplication(Applications.find((a) => a.id === applicationId))

        if (udise) {
            _qs.push(`${udise}`)
        }
        if (role) {
            _qs.push(`registrations.roles :${role}`)
        }
        refresh(applicationId, {page, queryString: `(${_qs.join(') AND (')})`})
    }, [applicationId, udise, role, page])

    useEffect(() => {
        if (user) {
            if (!permissions || !permissions.canRead) {
                logout();
            }
        }
    }, [user]);
    return (
        <DesktopList title={application?.name} addEnable={permissions?.canCreate} filters={[
            <Input key={'search-udise'} value={udise} placeholder={'Search User'}
                   onChange={(e) => setUDISE(e.target.value)}/>,
            <Select
                key={'role-search'}
                placeholder="Please select role"
                onSelect={(a: any) => setRole(a)}
                style={{width: '160px'}}
            >
                {
                    ['Teacher', 'Principal', 'school'].map((o) => {
                        return <Select.Option key={o} value={o}>{o}</Select.Option>
                    })
                }
            </Select>
        ]}>
            <Table loading={isLoading} dataSource={users} columns={columns} pagination={{
                current: currentPage, total: total,
                onChange: (_page) => {
                    setCurrentPage(_page);
                },
                pageSize: pageSize
            }}/>
        </DesktopList>
    )
}

export default UsersList
