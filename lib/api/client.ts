import {notification} from "antd";
import {getCookie} from "../utility";
import {StorageService} from "../utility/storage-service";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const clientGQL = (query: string, variables: any = {}) => {
    const token = localStorage.getItem('token');

    return fetch('https://hpsamarth-hasura.in/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `samarthDBHasuraPW5678`
        },
        body: JSON.stringify({query, variables}),
    })
}
export const client = async (endpoint: string, {body, baseUrl, ...customConfig}: any = {}) => {
    const headers: any = {'Content-Type': 'application/json'}
    if (customConfig?.['isMultipart']) {
        delete headers['Content-Type'];
    }
    const _baseUrl = baseUrl || BASE_URL;
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    }
    if (body) {
        config.body = JSON.stringify(body)
    }
    if (body && !customConfig?.['isMultipart']) {
        config.body = JSON.stringify(body)
    }
    if (customConfig?.['isMultipart']) {
        config.body = body

    }
    if (typeof window !== "undefined") {
        let data
        try {

            const response = await window.fetch(_baseUrl + endpoint, config)

            if (response.ok) {
                if (response.status === 204) {
                    return {
                        status: response.status,
                        headers: response.headers,
                        url: response.url,
                    }
                }
                data = await response.json()
                // Return a result object similar to Axios
                return {
                    status: response.status,
                    data,
                    headers: response.headers,
                    url: response.url,
                }
            } else if (response.status === 401) {
                notification.error({message: 'Un Authorized'})
            } else if (response.status === 403) {
                data = await response.json()
                notification.error({message: data.message || 'Forbidden'})
                return;

            } else if (response.status === 400) {
                data = await response.json()
                let message = '';
                let errors = [];
                if (data.exception?.fieldErrors) {
                    for (let i in data.exception?.fieldErrors) {
                        console.log(data.exception?.fieldErrors[i]);
                        errors.push(data.exception?.fieldErrors[i]?.map((a: any) => a.message)?.join(', '));
                    }
                } else {
                    data.exception
                }
                message = errors.join(', ');
                throw Error(message || 'Forbidden');
            } else if (response.body) {
                data = await response.json();
                notification.error({message: data.message})
                return {
                    status: response.status,
                    data,
                    headers: response.headers,
                    url: response.url,
                };
            }

            notification.error({message: response.statusText || 'Something went wrong'})

            return Promise.reject(response.statusText)
        } catch (err: any) {
            notification.error({message: err.message ? err.message : data})
            return Promise.reject(err.message ? err.message : data)
        }
    }

}

client.get = function (endpoint: string, customConfig: any = {}) {
    let params = [];
    if (customConfig.params) {
        for (let p in customConfig.params) {
            params.push(`${p}=${encodeURIComponent(customConfig.params[p])}`);
        }
    }

    if (customConfig.params) {
        return client(endpoint + '?' + params.join('&'), {...customConfig, method: 'GET'})
    } else {
        delete customConfig.params
        return client(endpoint, {...customConfig, method: 'GET'})
    }
}

client.post = function (endpoint: string, body: any, customConfig = {}) {
    return client(endpoint, {...customConfig, body, method: 'POST'})
}

client.put = function (endpoint: string, body: any, customConfig = {}) {
    return client(endpoint, {...customConfig, body, method: 'PUT'})
}

client.patch = function (endpoint: string, body: any, customConfig = {}) {
    return client(endpoint, {...customConfig, body, method: 'PATCH'})
}

client.delete = function (endpoint: string, customConfig = {}) {
    return client(endpoint, {...customConfig, method: 'DELETE'})
}

