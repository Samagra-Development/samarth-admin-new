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
  allSchool: any[];
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

export const AllSchoolQuery = `query($offset: Int, $district: String, $block:String, $cluster:String){
  school(offset:$offset,where:{location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
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
  school_aggregate(where: {location: {cluster: {_ilike: $cluster}, district: {_ilike: $district}, block: {_ilike: $block}}}) {
    aggregate {
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
  school_aggregate(where: { type: {_ilike: $type}, location: {cluster: {_ilike: $cluster}, district: {_ilike: $district}, block: {_ilike: $block}}}) {
    aggregate {
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
  const [allSchool, setAllSchool] = useState([] as any[]);

  const getAllSchools = async (params: any) => {
    setIsLoading(true);
    try {
      const res = await clientGQL(AllSchoolQuery, {
        offset: 0,
        district: params.district || "%%",
        block: params.block || "%%",
        cluster: params.cluster || "%%",
      });
      const response = await res.json();
      if (response?.data) {
        const tempData = response.data.school.map((element: any) => {
          const temp = {
            Id: element.id,
            ["Is Active"]: element.is_active,
            Name: element.name,
            Session: element.session,
            Type: element.type,
            UDISE: element.udise,
            District: element.location.district,
            Block: element.location.block,
            Cluster: element.location.cluster,
          };
          return temp;
        });

        setAllSchool(tempData)
      }
    } catch (err) {}
    setIsLoading(false);
  };

  const refresh = async ({
    numberOfResults: _numberOfResults_,
    page: _page_,
    queryString,
  }: FilterType = {}) => {
    try {
      setIsLoading(true);
      const _page = _page_ || 1;
      const _numberOfResults = _numberOfResults_ || 10;
      setStartRow(_numberOfResults * (_page - 1));
      setCurrentPage(_page);
      setPageSize(_numberOfResults);

      let response: any;
      let params: any = {
        limit: _numberOfResults,
        offset: _numberOfResults * (_page - 1),
      };
      if (queryString.search) {
        params.district = "%%";
        params.block = "%%";
        params.cluster = "%%";
        params.type = "%%";
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

      console.log(params);
      

      if (response?.data) {
        setTotal(response?.data?.school_aggregate?.aggregate?.count);
        setSchools(response.data.school);
      }
      getAllSchools(params);
    } catch (e) {}

    setIsLoading(false);
  };

  useEffect(() => {
  }, []);
  return {
    schools,
    isLoading,
    total,
    refresh,
    allSchool,
    pageSize,
    currentPage,
    startRow,
  };
};
