import {useEffect, useState} from "react";
import {client, clientGQL} from "../../client";
import {getLevelFromDesignation} from "../../../../components/designation-level";
import {LocationQuery} from "../locations/useLocations";
import {LocationInsertQuery} from "../locations/useLocationCreate";

type ReturnType = {
    user: any
    isLoading: boolean
    refresh: any
}
export const USER_BY_ID_QUERY = `query($id:uuid!){
  teacher(where:{user_id:{_eq:$id}}){
    designation
    employment
    account_status
  }
}`
export const useUserByIdFromHasura = (id: string): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null as any);
    const refresh = async (_id: string) => {
        try {
            setIsLoading(true)
            const res = await clientGQL(USER_BY_ID_QUERY, {
                id: _id
            })
            const response = await res.json();
            if (response?.data) {
                setUser(response?.data?.teacher?.[0]);
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        if(id){
            refresh(id);
        }
    }, [])
    return {
        user,
        isLoading,
        refresh,
    }
}
