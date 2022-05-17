import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client, clientGQL} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

type ReturnType = {
    location: any
    isLoading: boolean
    refresh: any
}
export const LocationByIdQuery = `query($id :Int!){
  location_by_pk(id:$id){
    cluster
    block
    district
    id
  }
}`
export type FilterType = {
    numberOfResults?: number,
    page?: number,
    [x: string]: any
}
export const useLocationById = (id: any): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [location, setLocation] = useState(null as any);
    const refresh = async (_id: any) => {
        try {
            setIsLoading(true)
            console.log(_id);
            console.log('===');
            const res = await clientGQL(LocationByIdQuery, {
                id: _id
            });
            const response = await res.json();
            console.log(response);
            if (response?.data) {
                setLocation(response.data.location_by_pk)
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        if (id) {
            refresh({id})
        }
    }, [])
    return {
        location,
        isLoading,
        refresh,
    }
}
