import {useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";
import {message, notification} from "antd";

type ReturnType = {
    user: any
    attemptLogin: any
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
    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user') as string));
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
        logout,
        isLoading,
        attemptLogin
    }
}
