import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  CodepenCircleFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLogin } from "../../lib/api/hooks/users/useLogin";
import { useLocations } from "../../lib/api/hooks/locations/useLocations";
import { DesktopList } from "../../components/layouts/list/desktop.list";
import { useGradeAssessments } from "../../lib/api/hooks/grade-assessments/useGradeAssessments";
import {
  getAllDistricts,
  getBlocks,
  getClusters,
} from "../../components/district-block-cluster";

const { Text } = Typography;
const GradeAssessments: NextPage = () => {
  const router = useRouter();
  const [application, setApplication] = useState(null as any);
  const [search, setSearch] = useState("" as any);
  const [role, setRole] = useState("" as any);
  const [page, setCurrentPage] = useState("" as any);
  const [selectedPopover, setSelectedPopover] = useState("" as any);
  const [_district, _setDistrict] = useState(null as any);
  const [_block, _setBlock] = useState(null as any);
  const [_cluster, _setCluster] = useState(null as any);
  //   const [assesmentType, setAssesmentType] = useState(null as any);
  const [gradeNumber, setGradeNumber] = useState(null as any);

  const { asPath } = router;
  const { user, logout } = useLogin();
  const { grades, pageSize, currentPage, total, refresh, isLoading } =
    useGradeAssessments({
      numberOfResults: 10,
      page: 1,
    });

  useEffect(() => {
    const _qs = { search, _district, _block, _cluster, gradeNumber };
    refresh({ page, queryString: _qs });
  }, [_district, _block, _cluster, search, role, page, gradeNumber]);
  const columns = [
    {
      title: "Assessment Name",
      dataIndex: ["assessment", "type"],
      key: "assessment_name",
    },
    {
        title: "Assessment Type",
        dataIndex: ["assessment","assessment_type", "name"],
        key: "assessment_type",
      },
      {
        title: "Date of Submission",
        dataIndex: ["created"],
        key: "created",
      },
    {
      title: "UDISE",
      dataIndex: ["school", "udise"],
      key: "udise",
    },
    {
      title: "Grade Number",
      dataIndex: "grade_number",
      key: "grade_number",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Stream Tag",
      dataIndex: ["stream", "tag"],
      key: "tag",
    },
    {
      title: "Actions",
      key: "actions",
      render: (a: any) => (
        <Space>
          {
            <Popover
              content={
                <div>
                  <Row gutter={20} wrap={false}>
                    <Col>
                      <Button onClick={() => {}} type={"primary"}>
                        Delete
                      </Button>
                    </Col>
                    <Col>
                      <Button danger={true}>Cancel</Button>
                    </Col>
                  </Row>
                </div>
              }
              title="Delete Assessment"
              placement={"left"}
              trigger="click"
              visible={selectedPopover === a.id}
              onVisibleChange={(e: any) => {
                if (!e) {
                  setSelectedPopover(false);
                }
              }}
            >
              <Button
                shape={"circle"}
                onClick={() => {
                  console.log(a);
                  setSelectedPopover(a.id);
                }}
              >
                <DeleteFilled />
              </Button>
            </Popover>
          }
        </Space>
      ),
    },
  ];
  return (
    <DesktopList
      title={"Grade Assessments"}
      addEnable={false}
      filters={[
        <Input
          key={"search-udise"}
          value={search}
          placeholder={"Search"}
          onChange={(e) => setSearch(e.target.value)}
        />,
        <Select
          key={"search-gradeNumber"}
          placeholder="Grade Number"
          allowClear={true}
          value={gradeNumber}
          style={{ minWidth: "150px" }}
          onChange={(a: any) => setGradeNumber(a)}
        >
          <Select.Option key={"1"} value={"1"}>
            {"1"}
          </Select.Option>
          <Select.Option key={"2"} value={"2"}>
            {"2"}
          </Select.Option>
          <Select.Option key={"3"} value={"3"}>
            {"3"}
          </Select.Option>
          <Select.Option key={"4"} value={"4"}>
            {"4"}
          </Select.Option>
        </Select>,
        <Select
          key={"search-designation-district"}
          placeholder="District"
          allowClear={true}
          value={_district}
          style={{ minWidth: "150px" }}
          onChange={(a: any) => _setDistrict(a)}
        >
          {getAllDistricts("", user?.user).map((o: any) => {
            return (
              <Select.Option key={o} value={o}>
                {o}
              </Select.Option>
            );
          })}
        </Select>,
        _district ? (
          <Select
            key={"search-designation-district-block"}
            placeholder="Block"
            allowClear={true}
            value={_block}
            style={{ minWidth: "150px" }}
            onChange={(a: any) => _setBlock(a)}
          >
            {getBlocks(_district, "", user?.user).map((o: any) => {
              return (
                <Select.Option key={o} value={o}>
                  {o}
                </Select.Option>
              );
            })}
          </Select>
        ) : (
          <></>
        ),
        _district && _block ? (
          <Select
            key={"search-designation-district-block-cluster"}
            placeholder="Cluster"
            allowClear={true}
            value={_cluster}
            style={{ minWidth: "150px" }}
            onChange={(a: any) => _setCluster(a)}
          >
            {getClusters(_block, "", user?.user).map((o: any) => {
              return (
                <Select.Option key={o} value={o}>
                  {o}
                </Select.Option>
              );
            })}
          </Select>
        ) : (
          <></>
        ),
      ]}
    >
      <Table
        loading={isLoading}
        dataSource={grades}
        columns={columns}
        pagination={{
          current: currentPage,
          total: total,
          onChange: (_page) => {
            setCurrentPage(_page);
            refresh({ page: _page });
          },
          pageSize: pageSize,
        }}
      />
    </DesktopList>
  );
};

export default GradeAssessments;
