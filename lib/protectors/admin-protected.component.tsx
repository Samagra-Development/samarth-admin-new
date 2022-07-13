import { Card,Typography, Space} from 'antd';
import {TokenProtectedComponent} from "./token-protected.component";

export const AdminProtectedComponent = ({children, shouldHide}: any) => {
    // const {user} = useSelector((state: any) => state.auth);
    //
    //  if (!user || user.type !== 'ADMIN') {
    //     if (shouldHide) {
    //         return <></>
    //     }
    //     return <Card className={'profile-authorize-card'}>
    //         <Space direction={'vertical'}>
    //             <Text>Not Authorize to access this feature</Text>
    //         </Space>
    //     </Card>
    // }
    const user ={};
    return <TokenProtectedComponent shouldHide={shouldHide}>
        {
            (...props: any) =>children(...props, user)
        }
    </TokenProtectedComponent>
}
