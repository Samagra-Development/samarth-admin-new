export function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname: string) {
    let name = cname + "=";
    if (typeof document === "undefined") {
        return ''
    }
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const Applications = [
    {
        name: 'E-Samvaad Users',
        id:'f0ddb3f6-091b-45e4-8c0f-889f89d4f5da',
        key: '/users/esamvaad'
    }, {
        name: 'Shiksha Saathi Users',
        id:'1ae074db-32f3-4714-a150-cc8a370eafd1',
        key: '/users/shiksha-saathi'
    }
]

export const CurrentRole = 'State Admin';