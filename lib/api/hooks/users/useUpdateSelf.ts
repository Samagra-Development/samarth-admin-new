import {useMutation, useQueryClient} from "react-query";
import {client} from "../../client";
import {useRouter} from "next/router";

type ReturnType = {
    data: any
    mutate: any
    isLoading: boolean
    error: any
}
export const SELF = 'users/self'
export const UPLOAD = 'upload';
export const UPLOAD_FILE = 'upload-file';

const updateSelf = (body = {}) => {
    return client.put(SELF, body)
}

const updateProfilePic = (file: any) => {
    const form = new FormData();
    form.append('file', file);
    return client.post(UPLOAD, form, {isMultipart: true})
}

const uploadPhoto = (file: any) => {
    const form = new FormData();
    form.append('file', file);
    return client.post(UPLOAD, form, {isMultipart: true})
}

export const useUpdateSelf = (): ReturnType => {
    const router = useRouter()
    const {mutate, data, isLoading, error} = useMutation((data: any) => updateSelf(data), {
        onSuccess: (data, variables, context) => {
            router.reload();
        },
    })
    return {
        mutate,
        data,
        isLoading,
        error
    }
}

export const useUpdateProfilePic = (): ReturnType => {
    const router = useRouter()
    const {mutate, data, isLoading, error} = useMutation((data: any) => updateProfilePic(data), {
        onSuccess: (data, variables, context) => {
            console.log(data)
            // router.reload();
        },
    })
    return {
        mutate,
        data,
        isLoading,
        error
    }
}

export const useUploadPhoto = (): ReturnType => {
    const router = useRouter()
    const {mutate, data, isLoading, error} = useMutation((data: any) => updateProfilePic(data), {
        onSuccess: (data, variables, context) => {
            console.log(data)
            // router.reload();
        },
    })
    return {
        mutate,
        data,
        isLoading,
        error
    }
}
