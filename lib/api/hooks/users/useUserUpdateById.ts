import {useMutation, useQueryClient} from "react-query";
import {client, clientGQL} from "../../client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {USERS} from "./useUsers";
import {LocationInsertQuery} from "../locations/useLocationCreate";

type ReturnType = {
    data: any
    mutate: any
    isLoading: boolean
    error: any
}
export const UPDATE_USER = 'admin/updateUser/'

export const UPDATE_USER_BY_ID_QUERY = `
mutation($object:teacher_set_input!, $id:uuid!){
  update_teacher(where:{user_id:{_eq:$id}}, _set:$object){
    returning{
      id
    }
  }
}`
export const useUserUpdateById = (): ReturnType => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null as any);
    const [error, setError] = useState(null as any);
    const mutate = async (id: string, data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const d = data.gql
            delete data['designation'];
            delete data['employment'];
            delete data['account_status'];
            delete data['gql'];
            const response = await client.patch(UPDATE_USER + id, data);
            if (d) {
                await clientGQL(UPDATE_USER_BY_ID_QUERY, {object: d, id: id})
            }

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
