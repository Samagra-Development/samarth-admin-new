import type {NextPage} from 'next'
import {Button, Card, Divider, Form, Input, Layout, Select, Space, Typography} from "antd";
import {useLogin} from "../lib/api/hooks/users/useLogin";
import {useEffect} from "react";
import {useRouter} from "next/router";

const {Title} = Typography;
const {Content} = Layout;

const LoginPage: NextPage = () => {
    const {attemptLogin, user, isLoading} = useLogin();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push('/users/esamvaad');
        }
        console.log(process.env);
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
                            <Input/>
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
