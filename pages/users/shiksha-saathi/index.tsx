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
import {ApplicationId} from "../../../components/shiksha-application";
import {designationLevels, getDistinctLevels, getLowerDesignations} from "../../../components/designation-level";
import {getAllDistricts, getBlocks, getClusters} from "../../../components/district-block-cluster";

const {Text} = Typography;
const UsersList: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const [search, setSearch] = useState('' as any);
    const [designation, setDesignation] = useState(null as any);
    const [_district, _setDistrict] = useState(null as any);
    const [_block, _setBlock] = useState(null as any);
    const [_cluster, _setCluster] = useState(null as any);
    const [role, setRole] = useState('' as any);
    const [page, setCurrentPage] = useState('' as any);
    const {asPath} = router;
    const applicationId = ApplicationId;
    const getApplicationQueryPart = () => `registrations.applicationId: ${applicationId}`;
    const {user, logout} = useLogin();
    const level = user?.user?.data?.roleData?.geographic_level;
    const permissions = Permissions[level]?.applications?.[applicationId];
    const {users, pageSize, currentPage, total, refresh, isLoading} = useUsers(applicationId, {
        queryString: `(${getApplicationQueryPart()})`,
        numberOfResults: 10,
        page: 1
    });
    useEffect(() => {
        if (level === 'District') {
            _setDistrict(user?.user?.data?.roleData?.district);
        } else if (level === 'Block') {
            _setDistrict(user?.user?.data?.roleData?.district);
            _setBlock(user?.user?.data?.roleData?.block);
        } else if (level === 'Cluster') {
            _setDistrict(user?.user?.data?.roleData?.district);
            _setBlock(user?.user?.data?.roleData?.block);
            _setCluster(user?.user?.data?.roleData?.cluster);
        }
    }, [user]);

    useEffect(() => {
        const _qs = [getApplicationQueryPart()];
        if (search) {
            _qs.push(search)
        }
        if (_district) {
            _qs.push(`data.roleData.district:${_district}`)
        }
        if (_block) {
            _qs.push(`data.roleData.block:${_block}`)
        }
        if (_cluster) {
            _qs.push(`data.roleData.cluster:${_cluster}`)
        }
        if (designation) {
            _qs.push(`registrations.roles :${designation.replaceAll('(','\\(').replaceAll(')','\\)').replaceAll('/','\\/')}`)
        }
        refresh(applicationId, {page, queryString: `(${_qs.join(') AND (')})`})
    }, [designation, _district, _block, applicationId, _cluster, search, role, page]);

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
        <DesktopList title={application?.name} addEnable={permissions?.canCreate} filters={[
            <Input key={'search-udise'} value={search} placeholder={'Search User'}
                   onChange={(e) => setSearch(e.target.value)}/>,
            <Select
                key={'search-designation'}
                placeholder="Designation"
                allowClear={true}
                value={designation}
                style={{minWidth: '150px'}}
                onChange={(a: any) => setDesignation(a)}
            >
                {
                    getLowerDesignations(user).map((o) => {
                        return <Select.Option key={o.designation}
                                              value={o.designation}>{o.designation}</Select.Option>
                    })
                }
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
