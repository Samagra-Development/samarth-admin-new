import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client, clientGQL} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

type ReturnType = {
    school: any
    isLoading: boolean
    refresh: any
}
export const SchoolByIdQuery = `query($id :Int!){
  school_by_pk(id:$id){
    name
    udise
    location_id
    session
    is_active
    type
    latitude
    longitude
    id
  }
}`
export type FilterType = {
    numberOfResults?: number,
    page?: number,
    [x: string]: any
}
export const useSchoolById = (id: any): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [school, setSchool] = useState(null as any);
    const refresh = async (_id: any) => {
        try {
            setIsLoading(true)
            const res = await clientGQL(SchoolByIdQuery,{
                id: _id
            });
            const response = await res.json();
            if (response?.data) {
                setSchool(response.data.school_by_pk)
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        if (id) {
            refresh(id)
        }
    }, [])
    return {
        school,
        isLoading,
        refresh,
    }
}
