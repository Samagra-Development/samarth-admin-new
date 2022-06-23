import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";
import {message, notification} from "antd";
import {Applications} from "../../../utility";

type ReturnType = {
    user: any
    attemptLogin: any
    userType: any
    logout: any
    isLoading: boolean
}
export const LOGIN = `user/login`;
const _attemptLogin = (body = {}) => {
    return client.post(LOGIN, body)
}
export const useLogin = (): ReturnType => {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null as any);
    const [userType, setUserType] = useState('ADMIN' as 'ADMIN' | 'SCHOOL');
    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user') as string));
            setUserType(localStorage.getItem('userType') as any);
        }
    }, []);
    const attemptLogin = async (credentials?: any) => {
        try {
            setIsLoading(true)
            const response = await client.post(LOGIN, {
                ...credentials,
                "applicationId": "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da"
            });
            if (response?.data?.result?.data?.user) {
                localStorage.setItem('user', JSON.stringify(response?.data?.result?.data?.user));
                localStorage.setItem('token', response?.data?.result?.data?.user?.token);
                const u = response?.data?.result?.data?.user;
                const {registrations} = u?.user;
                if (u) {
                    const eSamvaadRegistration = registrations?.find((a: any) => a.applicationId === Applications[0].id);

                    if (eSamvaadRegistration?.roles?.length === 1 && eSamvaadRegistration?.roles[0] === 'school') {
                        console.log('-');
                        console.log(eSamvaadRegistration);
                        localStorage.setItem('userType', 'SCHOOL');
                        setUserType('SCHOOL');
                    }
                }
                setUser(response?.data?.result?.data?.user);
            } else {
                notification.error({message: response?.data?.params?.errMsg});
            }
        } catch (e) {
            notification.error({message: "Unable to verify"});
        }
        setIsLoading(false);
    }
    const logout = async () => {
        setUser(null);
        localStorage.clear();
        router.push('/login');
    }
    return {
        user,
        userType,
        logout,
        isLoading,
        attemptLogin
    }
}
