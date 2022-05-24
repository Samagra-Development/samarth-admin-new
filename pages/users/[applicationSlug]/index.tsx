import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DesktopList} from "../../../components/layouts/list/desktop.list";
import {useUsers} from "../../../lib/api/hooks/users/useUsers";
import {Applications} from "../../../lib/utility";
import {Button, Space, Table} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";

const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const {asPath} = router;
    const {applicationSlug} = router.query;
    const {users, refresh, isLoading} = useUsers(applicationSlug as string);

    const columns = [
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
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Username Status',
            dataIndex: 'usernameStatus',
            key: 'usernameStatus',
        },
        {
            title: 'Verified',
            dataIndex: 'verified',
            key: 'verified',
            render: (a: boolean) => a ? <CheckCircleFilled/> : ''
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (a: any) => <Space>
                <Button shape={"circle"} onClick={
                    () => {
                        router.push(`${asPath}/${a.id}/edit`)
                    }
                }>
                    <EditFilled/>
                </Button>
            </Space>
        },
    ];
    useEffect(() => {
        if (applicationSlug) {
            refresh(applicationSlug)
            setApplication(Applications.find((a) => a.key === applicationSlug))
        }
    }, [applicationSlug])
    return (
        <DesktopList title={application?.name} addEnable={true}>
            <Table loading={isLoading} dataSource={users} columns={columns}/>
        </DesktopList>
    )
}

export default UsersList
