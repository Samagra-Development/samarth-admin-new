import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client, clientGQL} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";
import {USER_BY_ID_QUERY} from "./useUserByIdFromHasura";

type ReturnType = {
    users: any[]
    isLoading: boolean
    refresh: any
    total: number
    startRow: number
    currentPage: number
    pageSize: number
}
export const USERS = `admin/all`;
export const USERS_SEARCH = `admin/searchUser`;

export const QUERY_TEACHERS = `query($where:teacher_bool_exp!, $limit:Int!,$offset:Int){
  teacher(where:$where, limit:$limit, offset:$offset){
    user{
      username
      first_name
      last_name
      mobilePhone
    }
    user_id
    employment
    designation
    account_status
  }
}`
export const Applications: { [key: string]: string } = {
    "esamvaad": "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da",
    "shiksha-saathi": "1ae074db-32f3-4714-a150-cc8a370eafd1",
};
export type FilterType = {
    numberOfResults?: number,
    page?: number,
    [x: string]: any
}
export const useTeachers = ({
                                numberOfResults,
                                page,
                                queryString
                            }: FilterType = {}): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [startRow, setStartRow] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [users, setUsers] = useState([] as any[]);
    const refresh = async ({
                               numberOfResults: _numberOfResults_,
                               page: _page_,

                           }: FilterType = {}) => {
        try {
            setIsLoading(true)
            const _page = _page_ || 1;
            const _numberOfResults = _numberOfResults_ ? _numberOfResults_ : 10;
            setStartRow(_numberOfResults * (_page - 1));
            setCurrentPage(_page);
            setPageSize(_numberOfResults);
            let response: any;
            const res = await clientGQL(QUERY_TEACHERS, {
                where: {},
                limit: _numberOfResults,
                offset: _numberOfResults * (_page - 1)
            })
            if (res) {
                const data = await res.json();
                setUsers(data?.data?.teacher);
                console.log(data);
                console.log(_page);
                setCurrentPage(_page);
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        refresh({numberOfResults, page})
    }, [])
    return {
        users,
        isLoading,
        total,
        refresh,
        pageSize,
        currentPage,
        startRow
    }
}
