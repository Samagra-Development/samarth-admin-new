import type {NextPage} from 'next'
import {useRouter} from "next/router";

const Home: NextPage = () => {
    const router = useRouter();
    router.push('/login');
    return (
        <div>
        </div>
    )
}

export default Home
