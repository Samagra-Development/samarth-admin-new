import {useMutation, useQueryClient} from "react-query";
import {client, clientGQL} from "../../client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {LocationQuery} from "./useLocations";

type ReturnType = {
    data: any
    mutate: any
    isLoading: boolean
    error: any
}
export const LocationInsertQuery = `
mutation($object:location_insert_input!){
  insert_location_one(object:$object){
    cluster
    block
    district
  }
}`
export const useLocationCreate = (): ReturnType => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null as any);
    const [error, setError] = useState(null as any);
    const mutate = async (data: any, onSuccess?: any) => {
        try {
            setIsLoading(true)
            const res = await clientGQL(LocationInsertQuery, {object: data})
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
        isLoading,
        error
    }
}
