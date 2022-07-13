import type {NextPage} from 'next'
import styles from '../../styles/Users.module.scss';
import {Button, Card, Col, Form, Input, notification, Space, Tooltip} from "antd";
import {useRouter} from "next/router";
import {useLocationCreate} from "../../lib/api/hooks/locations/useLocationCreate";

const {useForm} = Form;
const CreateLocation: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useLocationCreate();
    return (
        <div className={styles.formWrapper}>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    style={{maxWidth: '400px'}}
                    initialValues={{}}
                    onFinish={(values: any) => {
                        mutate(values, (data: any) => {
                            notification.success({message: 'Location Added'});
                            router.back();
                        });
                    }}>

                    <Form.Item
                        label={'District'}
                        rules={[{required: true, message: 'District Required'}]}
                        name={['district']}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Block'}
                        rules={[{required: true, message: 'Block Required'}]}
                        name={['block']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Cluster'}
                        rules={[{required: true, message: 'Cluster Required'}]}
                        name={['cluster']}>
                        <Input/>
                    </Form.Item>

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

export default CreateLocation
