import type {NextPage} from 'next'
import styles from '../../../../styles/Users.module.scss';
import {Button, Card, Form, Input, Select, Space} from "antd";
import {useRouter} from "next/router";
import {useUserCreate} from "../../../lib/api/hooks/users/useUserCreate";
import {Applications} from "../../../lib/api/hooks/users/useUsers";

const {useForm} = Form;
const EditUser: NextPage = () => {
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
                        values['registration']['applicationId'] = Applications[applicationSlug as string];
                        mutate(values, (data: any) => {
                            router.back();
                        });
                    }}>
                    <Form.Item
                        label={'Username'}
                        name={['user', 'username']}>
                        <Input/>
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

export default EditUser
