import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client, clientGQL} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

export const USERS_SEARCH = `admin/searchUser`;

type ReturnType = {
    schools: any[]
    isLoading: boolean
    refresh: any
    total: number
    startRow: number
    currentPage: number
    pageSize: number
}
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
}`

// ,location : {district:{_ilike:$district}}
export const SchoolQuery2 = `query($limit:Int, $offset: Int, $udise: Int, $district: String, $block:String,$cluster:String,$type:String){
    school(limit:$limit, offset:$offset , where:{udise:{_eq:$udise},type: {_eq:$type}, location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
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
  }`
export const SchoolQuery3 = `query($limit:Int, $offset: Int, $name: String, $district: String, $block:String,$cluster:String,$type:String){
    school(limit:$limit, offset:$offset , where:{name:{_eq:$name},type: {_eq:$type}, location: {cluster:{_ilike:$cluster},district: {_ilike: $district},block:{_ilike:$block}}}){
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
  }`
export type FilterType = {
    numberOfResults?: number,
    page?: number,
    [x: string]: any
}
export const useSchools = ({numberOfResults, page, queryString}: FilterType = {}): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [startRow, setStartRow] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [schools, setSchools] = useState([] as any[]);
    const refresh = async ({
                               numberOfResults: _numberOfResults_,
                               page: _page_,
                               queryString,
                           }: FilterType = {}) => {
        try {
            setIsLoading(true)
            const _page = _page_ || 1;
            console.log(_page_)
            const _numberOfResults = _numberOfResults_ || 10;
            setStartRow(_numberOfResults * (_page - 1));
            setCurrentPage(_page);
            setPageSize(_numberOfResults);

            let response: any;
            console.log(queryString[0]);
            console.log('=-=-=-');
            let params: any = {
                limit: _numberOfResults,
                offset: _numberOfResults * (_page - 1),
            };
            if (queryString.length) {
                params.district = "%%";
                params.block = "%%";
                params.cluster = "%%";
                params.type = "%%"
                console.log(params);
                let q = SchoolQuery2;
                if (queryString.length > 1) {
                    params.district = queryString[1];
                }
                if (queryString.length > 2) {
                    params.block = queryString[2];
                }
                if (queryString.length > 3) {
                    params.cluster = queryString[3];
                }
                if (queryString.length > 4) {
                  params.type = queryString[4];
                  console.log(params)
              }

                if (isNaN(queryString[0])) {
                    params.name = queryString[0]
                    q = SchoolQuery3;
                } else {
                    params.udise = queryString[0]
                }
                const res = await clientGQL(q, params)
                response = await res.json();
            } else {
                const res = await clientGQL(SchoolQuery, {
                    limit: _numberOfResults,
                    offset: _numberOfResults * (_page - 1),
                })
                response = await res.json();
            }
            if (response?.data) {
                setTotal(response?.data?.school_aggregate?.aggregate?.count);
                setSchools(response.data.school)
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        refresh({numberOfResults, page})
    }, [])
    return {
        schools,
        isLoading,
        total,
        refresh,
        pageSize,
        currentPage,
        startRow
    }
}
