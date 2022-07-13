import type {NextPage} from 'next'
import {Typography} from "antd";

const {Title} = Typography;

const PageNotFound: NextPage = () => {
    return (
        <div>
            <Title>Page Not Found</Title>
        </div>
    )
}

export default PageNotFound
