import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

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
const fetchUsers = (body = {}) => {
    return client.post(USERS, body)
}
export const Applications: { [key: string]: string } = {
    "esamvaad": "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da",
    "shiksha-saathi": "1ae074db-32f3-4714-a150-cc8a370eafd1",
};
export type FilterType = {
    numberOfResults?: number,
    page?: number
}
export const useSchools = (_applicationId: string, {numberOfResults, page}: FilterType = {}): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [startRow, setStartRow] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [total, setTotal] = useState(0)
    const [users, setUsers] = useState([] as any[]);
    const refresh = async (applicationId?: string, {
        numberOfResults: _numberOfResults_,
        page: _page_
    }: FilterType = {}) => {
        try {
            setIsLoading(true)
            const _page = _page_ || 1;
            const _numberOfResults = _numberOfResults_ ? _numberOfResults_ * (_page - 1) : 10;
            setStartRow(_numberOfResults * (_page - 1));
            setCurrentPage(_page);
            setPageSize(_numberOfResults);
            const response = await client.post(USERS, {
                "applicationId": applicationId,
                "startRow": _numberOfResults * (_page - 1),
                "numberOfResults": _numberOfResults,
            })
            if (response?.data?.result) {
                setTotal(response?.data?.result.total);
                setUsers(response?.data?.result.users.map((u: any) => {
                    return {...u, fullName: u.fullName || (`${u.firstName} ${u.lastName || ''}`)}
                }))
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        refresh(_applicationId, {numberOfResults, page})
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
