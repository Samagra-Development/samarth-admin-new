import {useEffect, useState} from "react";
import {client} from "../../client";
import {getLevelFromDesignation} from "../../../../components/designation-level";

type ReturnType = {
    user: any
    isLoading: boolean
    refresh: any
}
export const USERS = `admin/all`;
export const USERS_SEARCH = `admin/searchUser`;

export const Applications: { [key: string]: string } = {
    "esamvaad": "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da",
    "shiksha-saathi": "1ae074db-32f3-4714-a150-cc8a370eafd1",
};
export type FilterType = {
    [x: string]: any
}
export const useUserById = (_applicationId: string, params: FilterType = {}): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null as any);
    const refresh = async (applicationId: string, _params: FilterType = {}) => {
        try {
            setIsLoading(true)
            let response: any;
            const p: any = [];
            // const p: any = [`registrations.applicationId:${applicationId || _applicationId}`];
            console.log(p);
            response = await client.get(USERS_SEARCH, {
                params: {
                    "queryString": _params.id,
                }
            })

            if (response?.data?.result) {
                const _u = response?.data?.result.users.map((u: any) => {
                    return {...u, fullName: u.fullName || (`${u.firstName} ${u.lastName || ''}`)}
                })[0];
                if (_u) {
                    _u['geographic_level'] = getLevelFromDesignation(_u?.registrations?.find((r: any)=>r.applicationId === applicationId)?.roles?.[0]);
                    _u['designation'] = _u?.registrations?.find((r: any)=>r.applicationId === applicationId)?.roles?.[0];
                    _u['district'] = _u['data']?.['roleData']?.['district'];
                    _u['block'] = _u['data']?.['roleData']?.['block'];
                    _u['cluster'] = _u['data']?.['roleData']?.['cluster'];
                    setUser(_u);
                }
            }
        } catch (e) {

        }
        setIsLoading(false);
    }
    useEffect(() => {
        refresh(_applicationId, params)
    }, [])
    return {
        user,
        isLoading,
        refresh,
    }
}
