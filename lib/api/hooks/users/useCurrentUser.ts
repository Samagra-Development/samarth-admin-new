import { useEffect, useState} from "react";
import {StorageService} from "../../../utility/storage-service";
import {client} from "../../client";
import {useQuery} from "react-query";
import {useRouter} from "next/router";

type ReturnType = {
    account: string | undefined
    user?: any
    isLoading: boolean
    setAccount: (account: string) => void
}
export const USER_BY_ACCOUNT = (account: string) => `users/accounts/${account}`;
const tryCreateAndFetchUserDetails = (account: string | undefined) => {
    return client.get(USER_BY_ACCOUNT(account as string), {})
}
const getAccount = () => {
    return StorageService.account
}

export const useCurrentUser = (): ReturnType => {
    const router = useRouter();
    const {data: account} = useQuery('current-account', getAccount, {refetchOnMount: false});
    const [user, setUser] = useState(null as any);
    const {data: userData, isLoading,} = useQuery(
        ['current-user', account],
        () => tryCreateAndFetchUserDetails(account), {
            retry: 0,
            enabled: !!account && !user,
            refetchOnMount: false
        });
    useEffect(() => {
        StorageService.user = userData?.data
        setUser(userData?.data);
    }, [userData])
    const setAccount = async (_account: string) => {
        StorageService.account = _account;
        router.reload();
    };
    return {
        account,
        setAccount,
        isLoading,
        user
    }
}
