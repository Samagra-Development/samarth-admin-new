import React from "react";
import 'antd/dist/antd.css'
import '../styles/Globals.scss'
import type {AppProps} from 'next/app'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { DesktopLayout } from "../components/layouts/layout";


function MyApp({Component, pageProps}: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient())
    // @ts-ignore
    return  <QueryClientProvider client={queryClient}>
         {/*@ts-ignore*/}
        <Hydrate state={pageProps.dehydratedState}>
            <DesktopLayout>
                <Component  {...pageProps} />
            </DesktopLayout>
        </Hydrate>
    </QueryClientProvider>
}

export default MyApp
