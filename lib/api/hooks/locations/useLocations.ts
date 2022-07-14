import { useEffect, useState } from "react";
import { StorageService } from "../../../utility/storage-service";
import { client, clientGQL } from "../../client";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

type ReturnType = {
  locations: any[];
  isLoading: boolean;
  refresh: any;
  total: number;
  startRow: number;
  currentPage: number;
  pageSize: number;
};
export const LocationQuery = `query($limit:Int, $offset: Int){
  location(limit:$limit, offset:$offset){
    cluster
    block
    district
    id
  }
  location_aggregate{
    aggregate{
      count
    }
  }
}`;
export const locationQuery3 = `query($limit:Int, $offset: Int, $district: String, $block:String, $cluster:String,$id:Int){
    location(limit:$limit, offset:$offset , where:{id: {_eq:$id}, cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}){
      cluster
      block
      district
      id
    }
    location_aggregate{
        aggregate{
          count
        }
    }
  }`;
  export const locationQuery2 = `query($limit:Int, $offset: Int, $district: String, $block:String, $cluster:String){
    location(limit:$limit, offset:$offset , where:{cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}){
      cluster
      block
      district
      id
    }
    location_aggregate{
        aggregate{
          count
        }
    }
  }`;
export type FilterType = {
  numberOfResults?: number;
  page?: number;
  [x: string]: any;
};
export const useLocations = ({
  numberOfResults,
  page,
}: FilterType = {}): ReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [startRow, setStartRow] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [locations, setLocations] = useState([] as any[]);
  const refresh = async ({
    queryString,
    numberOfResults: _numberOfResults_,
    page: _page_,
  }: FilterType = {}) => {
    try {
      setIsLoading(true);
      const _page = _page_ || 1;
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
        params.id = "%%";
        let q = locationQuery3;
        params.id = queryString.search;
        if (queryString._district) {
          params.district = queryString._district;
        }
        if (queryString._block) {
          params.block = queryString._block;
        }
        if (queryString._cluster) {
          params.cluster = queryString._cluster;
        }

        const res = await clientGQL(q, params);
        response = await res.json();
      }else{
        params.district = "%%";
        params.block = "%%";
        params.cluster = "%%";
        console.log(params);
        let q = locationQuery2;
        if (queryString._district) {
          params.district = queryString._district;
        }
        if (queryString._block) {
          params.block = queryString._block;
        }
        if (queryString._cluster) {
          params.cluster = queryString._cluster;
        }

        const res = await clientGQL(q, params);
        response = await res.json();
      }
      if (response?.data) {
        setTotal(response?.data?.location_aggregate?.aggregate?.count);
        setLocations(response.data.location);
      }
    } catch (e) {}
    setIsLoading(false);
  };
  useEffect(() => {
    refresh({ numberOfResults, page });
  }, []);
  return {
    locations,
    isLoading,
    total,
    refresh,
    pageSize,
    currentPage,
    startRow,
  };
};
