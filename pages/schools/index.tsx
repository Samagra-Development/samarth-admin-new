import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {Button, Form, Input, Select, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../lib/api/hooks/users/useLogin";
import {useLocations} from "../../lib/api/hooks/locations/useLocations";
import {DesktopList} from "../../components/layouts/list/desktop.list";
import {useSchools} from "../../lib/api/hooks/schools/useSchools";

const {Text} = Typography;
const SchoolsList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const [search, setSearch] = useState('' as any);
    const [role, setRole] = useState('' as any);
    const [page, setCurrentPage] = useState('' as any);
    const {asPath} = router;
    const {user, logout} = useLogin();
    const {schools, pageSize, currentPage, total, refresh, isLoading} = useSchools({
        numberOfResults: 10,
        page: 1
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'id',
        }, {
            title: 'Udise',
            dataIndex: 'udise',
            key: 'udise',
        }, {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: 'Active State',
            dataIndex: 'is_active',
            render: (a: any) => !!a ? <CheckCircleFilled/> : <></>,
            key: 'active',
        },
        {
            title: 'District',
            dataIndex: ['location', 'district'],
            key: 'district',
        },
        {
            title: 'Block',
            dataIndex: ['location', 'block'],

            key: 'block',
        },
        {
            title: 'Cluster',
            dataIndex: ['location', 'cluster'],

            key: 'cluster',
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (a: any) => <Space>
                {
                    <Button shape={"circle"}>
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
    return (
        <DesktopList title={application?.name} addEnable={true} filters={[
            <Input key={'search-udise'} value={search} placeholder={'Search'}
                   onChange={(e) => setSearch(e.target.value)}/>,
        ]}>
            <Table loading={isLoading} dataSource={schools} columns={columns} pagination={{
                current: currentPage, total: total,
                onChange: (_page) => {
                    setCurrentPage(_page);
                    refresh({page: _page})
                },
                pageSize: pageSize
            }}/>
        </DesktopList>
    )
}

export default SchoolsList
