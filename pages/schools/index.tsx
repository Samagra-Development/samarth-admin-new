import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {Button, Form, Input, Select, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, EditFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../lib/api/hooks/users/useLogin";
import {useLocations} from "../../lib/api/hooks/locations/useLocations";
import {DesktopList} from "../../components/layouts/list/desktop.list";
import {useSchools} from "../../lib/api/hooks/schools/useSchools";
import {CSVLink} from "react-csv";
// import {ApplicationId} from "../../components/shiksha-application";

import {getAllDistricts, getBlocks, getClusters} from "../../components/district-block-cluster";

const {Text} = Typography;
const SchoolsList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const [search, setSearch] = useState('' as any);
    const [_district, _setDistrict] = useState(null as any);
    const [type, setType] = useState(null as any);
    const [_block, _setBlock] = useState(null as any);
    const [_cluster, _setCluster] = useState(null as any);
    const [role, setRole] = useState('' as any);
    const [page, setCurrentPage] = useState('' as any);
    
    const {asPath} = router;
    const {user, logout} = useLogin();
    const {schools, pageSize, currentPage, total, refresh, isLoading,allSchools} = useSchools({
        numberOfResults: 10,
        page: 1
    });
    console.log(total)
    console.log(allSchools);

    useEffect(() => {
        const _qs = {search,_district,_block,_cluster,type};
        refresh({page, queryString: _qs})
    }, [_district, _block,_cluster, search, role, page,type]);

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
                    <Button shape={"circle"}  onClick={
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
    return (
        <DesktopList title={application?.name} addEnable={true} filters={[
            <CSVLink
              filename={"Expense_Table.csv"}
              data={allSchools}
              className="btn btn-primary"
            >
              Export to CSV
            </CSVLink>,
            <Input key={'search-udise'} value={search} placeholder={'Search'}
                   onChange={(e: any) => setSearch(e.target.value)}/>,
                <Select
                   key={'search-school-type'}
                   placeholder="Type"
                   allowClear={true}
                   value={type}
                   style={{minWidth: '150px'}}
                   onChange={(a: any) => setType(a)}
               >
                   <Select.Option key={"GPS"} value={"GPS"}>{"GPS"}</Select.Option>
                   <Select.Option key={"GMS"} value={"GMS"}>{"GMS"}</Select.Option>
                   <Select.Option key={"GHS"} value={"GHS"}>{"GHS"}</Select.Option>
                   <Select.Option key={"GSSS"} value={"GSSS"}>{"GSSS"}</Select.Option>
               </Select>,
               <Select
                   key={'search-designation-district'}
                   placeholder="District"
                   allowClear={true}
                   value={_district}
                   style={{minWidth: '150px'}}
                   onChange={(a: any) => _setDistrict(a)}
               >
                   {
                       getAllDistricts('', user?.user).map((o: any) => {
                           return <Select.Option key={o}
                                                 value={o}>{o}</Select.Option>
                       })
                   }
               </Select>,
               _district ? <Select
                   key={'search-designation-district'}
                   placeholder="Block"
                   allowClear={true}
                   value={_block}
                   style={{minWidth: '150px'}}
                   onChange={(a: any) => _setBlock(a)}
               >
                   {
                       getBlocks(_district, '', user?.user).map((o: any) => {
                           return <Select.Option key={o}
                                                 value={o}>{o}</Select.Option>
                       })
                   }
               </Select> : <></>,
               _district && _block ? <Select
                   key={'search-designation-district'}
                   placeholder="Cluster"
                   allowClear={true}
                   value={_cluster}
                   style={{minWidth: '150px'}}
                   onChange={(a: any) => _setCluster(a)}
               >
                   {
                       getClusters(_block, '', user?.user).map((o: any) => {
                           return <Select.Option key={o}
                                                 value={o}>{o}</Select.Option>
                       })
                   }
               </Select> : <></>
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
