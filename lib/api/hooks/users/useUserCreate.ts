import {useMutation, useQueryClient} from "react-query";
import {client} from "../../client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {USERS} from "./useUsers";

type ReturnType = {
    data: any
    mutate: any
    changePassword: any
    isLoading: boolean
    error: any
}
export const USER_CREATE = 'admin/createUser'
export const CHANGE_PASSWORD = 'admin/changePassword'

export const useUserCreate = (): ReturnType => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null as any);
    const [error, setError] = useState(null as any);
    const mutate = async (data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const response = await client.post(USER_CREATE, data);
            if (onSuccess) {
                onSuccess(response)
            }
        } catch (e) {
            setError(e);
        }
        setIsLoading(false)

    }
    const changePassword = async (data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const response = await client.post(CHANGE_PASSWORD, data);
            if (onSuccess) {
                onSuccess(response)
            }
        } catch (e) {
            setError(e);
        }
        setIsLoading(false)

    }
    return {
        mutate,
        changePassword,
        data,
        isLoading,
        error
    }
}
