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
export const SCHOOL_BY_UDISE = `query($udise: String!){
  old_schools(limit:10, where:{udise:{_eq:$udise}}){
     name
     id
  }
}`;
export const Applications: { [key: string]: string } = {
    "esamvaad": "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da",
    "shiksha-saathi": "1ae074db-32f3-4714-a150-cc8a370eafd1",
};
export type FilterType = {
    numberOfResults?: number,
    page?: number
}
export const useSearchSchoolByUDISE = (): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [school, setSchool] = useState(null as any);
    const refresh = async (udise: string) => {
        try {
            setIsLoading(true)
            const response = await clientGQL(SCHOOL_BY_UDISE, {
                udise
            })
            const d = await response.json();
            if (d.data?.old_schools?.[0]) {
                setSchool(d.data?.old_schools?.[0]);
            } else {
                setSchool(null)
            }
        } catch (e) {
            setSchool(null)
        }
        setIsLoading(false);
    }

    return {
        school,
        isLoading,
        refresh,

    }
}
