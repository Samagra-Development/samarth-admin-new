import type {NextPage} from 'next'
import styles from '../../../styles/Users.module.scss';
import {Button, Card, Form, Input, Select, Space} from "antd";
import {useRouter} from "next/router";
import {ApplicationId} from "./application";
import {useUserCreate} from "../../lib/api/hooks/users/useUserCreate";

const {useForm} = Form;
const CreateUser: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useUserCreate();
    const {applicationSlug} = router.query;
    return (
        <div className={styles.formWrapper}>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    style={{maxWidth: '400px'}}
                    onFinish={(values: any) => {
                        values = {...values, registration: values.user};
                        console.log(values);
                        values['registration']['applicationId'] = ApplicationId;
                        mutate(values, (data: any) => {
                            router.back();
                        });
                    }}>
                    <Form.Item
                        label={'First Name'}
                        name={['user', 'firstName']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Username'}
                        name={['user', 'username']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Roles'}
                        name={['user', 'roles']}>
                        <Select
                            mode="tags"
                            placeholder="Please select"
                            style={{width: '100%'}}
                        >
                            {
                                ['Teacher', 'Principal', 'School'].map((o) => {
                                    return <Select.Option key={o} value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={'Password'}
                        name={['user', 'password']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Timezone'}
                        name={['user', 'timezone']}>
                        <Select>
                            {
                                ['Asia/Kolkata'].map((status: string) => {
                                    return <Select.Option key={status}>{status}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={'Username Status'}
                        name={['user', 'usernameStatus']}>
                        <Select>
                            {
                                ['ACTIVE'].map((status: string) => {
                                    return <Select.Option key={status}>{status}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label={'Registration Username'}*/}
                    {/*    name={['registration', 'username']}>*/}
                    {/*    <Input/>*/}
                    {/*</Form.Item>*/}

                    {/*<Form.Item*/}
                    {/*    label={'Timezone'}*/}
                    {/*    name={['registration', 'timezone']}>*/}
                    {/*    <Input/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item*/}
                    {/*    label={'Username Status'}*/}
                    {/*    name={['registration', 'usernameStatus']}>*/}
                    {/*    <Select>*/}
                    {/*        {*/}
                    {/*            ['ACTIVE'].map((status: string) => {*/}
                    {/*                return <Select.Option key={status}>{status}</Select.Option>*/}
                    {/*            })*/}
                    {/*        }*/}
                    {/*    </Select>*/}
                    {/*</Form.Item>*/}
                    <Form.Item>
                        <Space>
                            <Button htmlType={'submit'} type={'primary'} loading={isLoading}>
                                Submit
                            </Button>
                            <Button onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default CreateUser
