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
import {useTeachers} from "../../../lib/api/hooks/users/useTeachers";

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
    const {users, pageSize, currentPage, total, refresh, isLoading} = useTeachers({
        numberOfResults: 10,
        page: 1
    });
    const columns = [
        {
            title: 'Username',
            dataIndex: ['user', 'username'],
            key: 'username',
        },
        {
            title: 'Full Name',
            dataIndex: ['user', 'first_name'],
            key: 'fullName',
        },
        {
            title: 'Mobile Phone',
            dataIndex: ['user', 'mobilePhone'],
            key: 'mobilePhone',
        },

        {
            title: 'Mode of Employment',
            dataIndex: ['employment'],
            key: 'employment',
        },
        {
            title: 'Designation',
            dataIndex: ['designation'],
            key: 'designation',
        },
        {
            title: 'Account Status',
            dataIndex: ['account_status'],
            key: 'account_status',
            render:(a:string)=>{
                if(a==='PENDING'){
                    return <Tag color={'yellow'}>{a}</Tag>
                }
                if(a==='REJECTED'){
                    return <Tag color={'red'}>{a}</Tag>
                }
                if(a==='ACTIVE'){
                    return <Tag color={'green'}>{a}</Tag>
                }
                return <Tag>{a}</Tag>
            }
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (a: any) => <Space>
                {
                   <Button shape={"circle"} onClick={
                        () => {
                            router.push(`${asPath}/${a.user_id}/edit`)
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

    return (
        <DesktopList title={'Teachers'} addEnable={false} filters={[
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
