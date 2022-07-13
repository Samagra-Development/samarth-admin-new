import {Button, Card, Typography, notification, Skeleton, Space, Tabs} from 'antd';
import React, {Component} from 'react';
import {StorageService} from "../utility/storage-service";
import {useCurrentUser} from "../api/hooks/users/useCurrentUser";

const {Text} = Typography;
export const TokenProtectedComponent = ({children, shouldHide, isAuthorProtected}: any) => {
    //
    // if (!user) {
    //     if (shouldHide) {
    //         return <></>
    //     }
    //     return <Card className={'profile-authorize-card'}>
    //         {/*<Space direction={'vertical'}>*/}
    //         {/*    <Button onClick={authorize} loading={authenticating}>*/}
    //         {/*        Authorize Application*/}
    //         {/*    </Button>*/}
    //         {/*    <Text>Authorize application to make changes to you profile</Text>*/}
    //         {/*</Space>*/}
    //     </Card>
    // }
    const childrenWithProps = React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, {user});
        }
        return child;
    });
    return <>
        {childrenWithProps}
    </>
}
