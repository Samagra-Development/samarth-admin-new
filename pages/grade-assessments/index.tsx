import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {Button, Form, Input, Select, Space, Table, Tag, Typography} from "antd";
import {CheckCircleFilled, CodepenCircleFilled, DeleteFilled} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useLogin} from "../../lib/api/hooks/users/useLogin";
import {useLocations} from "../../lib/api/hooks/locations/useLocations";
import {DesktopList} from "../../components/layouts/list/desktop.list";
import {useGradeAssessments} from "../../lib/api/hooks/grade-assessments/useGradeAssessments";

const {Text} = Typography;
const GradeAssessments: NextPage = () => {
    const router = useRouter()
    const [application, setApplication] = useState(null as any);
    const [search, setSearch] = useState('' as any);
    const [role, setRole] = useState('' as any);
    const [page, setCurrentPage] = useState('' as any);
    const {asPath} = router;
    const {user, logout} = useLogin();
    const {grades, pageSize, currentPage, total, refresh, isLoading} = useGradeAssessments({
        numberOfResults: 10,
        page: 1
    });
    const columns = [
        {
            title: 'Assessment Name',
            dataIndex: ['assessment', 'type'],
            key: 'assessment_name',
        },
        {
            title: 'UDISE',
            dataIndex: ['school', 'udise'],
            key: 'udise',
        },
        {
            title: 'Grade Number',
            dataIndex: 'grade_number',
            key: 'grade_number',
        },
        {
            title: 'Section',
            dataIndex: 'section',
            key: 'section',
        },
        {
            title: 'Stream Tag',
            dataIndex: ['stream', 'tag'],
            key: 'tag',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (a: any) => <Space>
                {
                    <Button shape={"circle"} onClick={
                        () => {

                        }
                    }>
                        <DeleteFilled/>
                    </Button>
                }
            </Space>
        },
    ];
    return (
        <DesktopList title={'Grade Assessments'} addEnable={true} filters={[
            <Input key={'search-udise'} value={search} placeholder={'Search'}
                   onChange={(e) => setSearch(e.target.value)}/>,
        ]}>
            <Table loading={isLoading} dataSource={grades} columns={columns} pagination={{
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


export default GradeAssessments
