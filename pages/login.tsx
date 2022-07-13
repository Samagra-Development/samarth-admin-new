import type {NextPage} from 'next'
import {Button, Card, Divider, Form, Input, Layout, Select, Space, Typography} from "antd";
import {useLogin} from "../lib/api/hooks/users/useLogin";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {Applications} from "../lib/utility";

const {Password} = Input;

const {Title} = Typography;
const {Content} = Layout;

const LoginPage: NextPage = () => {
    const {attemptLogin, user, isLoading} = useLogin();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            let found = false;
            const {registrations} = user?.user;
            if (registrations?.length) {
                const eSamvaadRegistration = registrations?.find((a: any) => a.applicationId === Applications[0].id);
                if (eSamvaadRegistration?.roles?.length === 1 && eSamvaadRegistration?.roles[0] === 'school') {
                    found = true;
                    router.push('/users/teachers');
                }
            }
            if (!found)
                router.push('/users/esamvaad');
        }
    }, [user]);
    return (
        <Content>
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card style={{width: '500px'}}>
                    <Title level={3}>Login</Title>
                    <Divider/>
                    <Form
                        layout="vertical"
                        initialValues={{
                            "loginId": "",
                            "password": "",
                        }}
                        style={{maxWidth: '400px'}}
                        onFinish={async (values: any) => {
                            attemptLogin(values);
                        }}>
                        <Form.Item
                            label={'Username'}
                            name={'loginId'}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label={'Password'}
                            name={'password'}>
                            <Password/>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button htmlType={'submit'} type={'primary'} loading={isLoading}>
                                    Submit
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Content>
    )
}

export default LoginPage;
