import {useMutation, useQueryClient} from "react-query";
import {client} from "../../client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {USERS} from "./useUsers";

type ReturnType = {
    data: any
    mutate: any
    isLoading: boolean
    error: any
}
export const UPDATE_USER = 'admin/updateUser/'

export const useUserUpdateById = (): ReturnType => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null as any);
    const [error, setError] = useState(null as any);
    const mutate = async (id: string, data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const response = await client.patch(UPDATE_USER + id, data);
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
        data,
        isLoading,
        error
    }
}
