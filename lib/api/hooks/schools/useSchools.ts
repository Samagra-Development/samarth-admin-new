import { useEffect, useState } from "react";
import { StorageService } from "../../../utility/storage-service";
import { client, clientGQL } from "../../client";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export const USERS_SEARCH = `admin/searchUser`;

type ReturnType = {
  schools: any[];
  isLoading: boolean;
  refresh: any;
  allSchools: any[];
  total: number;
  startRow: number;
  currentPage: number;
  pageSize: number;
};
export const SchoolQuery = `query($limit:Int, $offset: Int){
  school(limit:$limit, offset:$offset){
    location{
        cluster
        block
        district
    }
    type
    name
    udise
    session
    is_active
    id
  }
  school_aggregate{
    aggregate{
      count
    }
  }
}`;

export const AllSchoolQuery = `query($offset: Int){
  school(offset:$offset){
    location{
        cluster
        block
        district
    }
    type
    name
    udise
    session
    is_active
    id
  }
  school_aggregate{
    aggregate{
      count
    }
  }
}`;

export const SchoolQuery1 = `query($limit:Int, $offset: Int, $district: String, $block:String,$cluster:String,$type:String){
  school(limit:$limit, offset:$offset , where:{type: {_ilike:$type}, location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
    location{
        cluster
        block
        district
    }
    type
    name
    udise
    session
    is_active
    id
  }
  school_aggregate{
    aggregate{
      count
    }
  }
}`;
export const SchoolQuery2 = `query($limit:Int, $offset: Int, $udise: Int, $district: String, $block:String,$cluster:String,$type:String){
    school(limit:$limit, offset:$offset , where:{udise:{_eq:$udise},type: {_ilike:$type}, location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
      location{
          cluster
          block
          district
      }
      type
      name
      udise
      session
      is_active
      id
    }
    school_aggregate(where: {udise: {_eq: $udise}, type: {_ilike: $type}, location: {cluster: {_ilike: $cluster}, district: {_ilike: $district}, block: {_ilike: $block}}}) {
    aggregate {
      count
    }
  }
  }`;
export const SchoolQuery3 = `query($limit:Int, $offset: Int, $name: String, $district: String, $block:String,$cluster:String,$type:String){
    school(limit:$limit, offset:$offset , where:{name:{_ilike:$name},type: {_ilike:$type}, location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
      location{
          cluster
          block
          district
      }
      type
      name
      udise
      session
      is_active
      id
    }
    school_aggregate(where: {name: {_eq: $name}, type: {_ilike: $type}, location: {cluster: {_ilike: $cluster}, district: {_ilike: $district}, block: {_ilike: $block}}}) {
    aggregate {
      count
    }
  }
  }`;
export type FilterType = {
  numberOfResults?: number;
  page?: number;
  [x: string]: any;
};
export const useSchools = ({
  numberOfResults,
  page,
  queryString,
}: FilterType = {}): ReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [startRow, setStartRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [schools, setSchools] = useState([] as any[]);
  const [allSchools, setAllSchools] = useState([] as any[]);
  const refresh = async ({
    numberOfResults: _numberOfResults_,
    page: _page_,
    queryString,
  }: FilterType = {}) => {
    try {
      setIsLoading(true);
      const _page = _page_ || 1;
      console.log(_page_);
      const _numberOfResults = _numberOfResults_ || 10;
      setStartRow(_numberOfResults * (_page - 1));
      setCurrentPage(_page);
      setPageSize(_numberOfResults);

      let response: any;
      console.log(queryString);
      console.log("=-=-=-");
      let params: any = {
        limit: _numberOfResults,
        offset: _numberOfResults * (_page - 1),
      };
      if (queryString.search) {
        params.district = "%%";
        params.block = "%%";
        params.cluster = "%%";
        params.type = "%%";
        console.log(params);
        let q = SchoolQuery2;
        if (queryString._district) {
          params.district = queryString._district;
        }
        if (queryString._block) {
          params.block = queryString._block;
        }
        if (queryString._cluster) {
          params.cluster = queryString._cluster;
        }
        if (queryString.type) {
          params.type = queryString.type;
        }

        if (isNaN(queryString.search)) {
          params.name = "%" + queryString.search + "%";
          q = SchoolQuery3;
        } else {
          params.udise = queryString.search;
        }
        const res = await clientGQL(q, params);
        response = await res.json();
      } else if (!queryString.search) {
        params.district = "%%";
        params.block = "%%";
        params.cluster = "%%";
        params.type = "%%";
        console.log(params);
        let q = SchoolQuery2;
        if (queryString._district) {
          params.district = queryString._district;
        }
        if (queryString._block) {
          params.block = queryString._block;
        }
        if (queryString._cluster) {
          params.cluster = queryString._cluster;
        }
        if (queryString.type) {
          params.type = queryString.type;
        }
        q = SchoolQuery1;
        const res = await clientGQL(q, params);
        response = await res.json();
      } else {
        const res = await clientGQL(SchoolQuery, {
          limit: _numberOfResults,
          offset: _numberOfResults * (_page - 1),
        });
        response = await res.json();
      }
      if (response?.data) {
        setTotal(response?.data?.school_aggregate?.aggregate?.count);
        setSchools(response.data.school);
      }
    } catch (e) {}
    setIsLoading(false);
  };
  const getAllSchools = async () => {
    setIsLoading(true);
    try {
      const res = await clientGQL(AllSchoolQuery, {
        offset: 0,
      });
      const response = await res.json();

      if (response?.data) {
        const data: any = [];
        const tempData = response.data.school.map((element: any) => {
          const temp = {
            Id: "",
            "Is Active": "",
            Name: "",
            Session: "",
            Type: "",
            UDISE: "",
            District: "",
            Block: "",
            Cluster: "",
          };

          temp.Id = element.id;
          temp["Is Active"] = element.is_active;
          temp.Name = element.name;
          temp.Session = element.session;
          temp.Type = element.type;
          temp.UDISE = element.udise;
          temp.District = element.location.district;
          temp.Block = element.location.block;
          temp.Cluster = element.location.cluster;

          data.push(temp);
          return temp
        });
        setAllSchools(tempData);
      }
    } catch (err) {}
    setIsLoading(false);
  };

  useEffect(() => {
    refresh({ numberOfResults, page });
    getAllSchools();
  }, []);
  return {
    schools,
    isLoading,
    total,
    refresh,
    allSchools,
    pageSize,
    currentPage,
    startRow,
  };
};
