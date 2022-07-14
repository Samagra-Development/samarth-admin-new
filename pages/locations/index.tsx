import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CheckCircleFilled,
  CodepenCircleFilled,
  EditFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLogin } from "../../lib/api/hooks/users/useLogin";
import { useLocations } from "../../lib/api/hooks/locations/useLocations";
import { DesktopList } from "../../components/layouts/list/desktop.list";
import {
  getAllDistricts,
  getBlocks,
  getClusters,
} from "../../components/district-block-cluster";

const { Text } = Typography;
const UsersList: NextPage = () => {
  const router = useRouter();
  const [application, setApplication] = useState(null as any);
  const [search, setSearch] = useState("" as any);
  const [role, setRole] = useState("" as any);
  const [page, setCurrentPage] = useState("" as any);
  const [_district, _setDistrict] = useState(null as any);
  const [_block, _setBlock] = useState(null as any);
  const [_cluster, _setCluster] = useState(null as any);
  const { asPath } = router;
  const { user, logout } = useLogin();
  const level = user?.user?.data?.roleData?.geographic_level;

  const { locations, pageSize, currentPage, total, refresh, isLoading } =
    useLocations({
      numberOfResults: 10,
      page: 1,
    });
  useEffect(() => {
    if (level === "District") {
      _setDistrict(user?.user?.data?.roleData?.district);
    } else if (level === "Block") {
      _setDistrict(user?.user?.data?.roleData?.district);
      _setBlock(user?.user?.data?.roleData?.block);
    } else if (level === "Cluster") {
      _setDistrict(user?.user?.data?.roleData?.district);
      _setBlock(user?.user?.data?.roleData?.block);
      _setCluster(user?.user?.data?.roleData?.cluster);
    }
  }, [user]);
  useEffect(() => {
    const _qs = { search, _district, _block, _cluster };
    refresh({ page, queryString: _qs });
  }, [_district, _block, _cluster, search, role, page]);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Block",
      dataIndex: ["block"],
      key: "block",
    },
    {
      title: "Cluster",
      dataIndex: ["cluster"],
      key: "cluster",
    },

    {
      title: "Actions",
      key: "actions",
      render: (a: any) => (
        <Space>
          {
            <Button
              shape={"circle"}
              onClick={() => {
                router.push(`${asPath}/${a.id}/edit`);
              }}
            >
              <EditFilled />
            </Button>
          }
        </Space>
      ),
    },
  ];
  return (
    <DesktopList
      title={application?.name}
      addEnable={true}
      filters={[
        <Input
          key={"search-Id"}
          value={search}
          placeholder={"Search"}
          onChange={(e) => setSearch(e.target.value)}
        />,
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
            key={"search-designation-district"}
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
            key={"search-designation-district"}
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
        dataSource={locations}
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

export default UsersList;
