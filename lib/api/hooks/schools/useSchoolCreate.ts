import {client, clientGQL} from "../../client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

type ReturnType = {
    data: any
    update: any
    mutate: any
    isLoading: boolean
    error: any
}
export const SchoolInsertQuery = `
mutation($object:school_insert_input!){
  insert_school_one(object:$object){
    id
  }
}`

export const SchoolUpdateQuery = `
mutation($object:school_set_input!,$id:Int!){
  update_school_by_pk(pk_columns:{id:$id},_set:$object){
    id
  }
}`


export const useSchoolCreate = (): ReturnType => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null as any);
    const [error, setError] = useState(null as any);
    const mutate = async (data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const res = await clientGQL(SchoolInsertQuery, {object: data})
            const response = await res.json();
            if (response?.data) {
                if (onSuccess) {
                    onSuccess(response)
                }
            }

        } catch (e) {
            setError(e);
        }
        setIsLoading(false)

    }
    const update = async (id: any, data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const res = await clientGQL(SchoolUpdateQuery, {object: data, id})
            const response = await res.json();
            if (response?.data) {
                if (onSuccess) {
                    onSuccess(response)
                }
            }

        } catch (e) {
            setError(e);
        }
        setIsLoading(false)

    }
    return {
        mutate,
        data,
        update,
        isLoading,
        error
    }
}
