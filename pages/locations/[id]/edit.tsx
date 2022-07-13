import type {NextPage} from 'next'
import styles from '../../../styles/Users.module.scss';
import {Button, Card, Col, Form, Input, notification, Space, Tooltip} from "antd";
import {useRouter} from "next/router";
import {useLocationUpdate} from "../../../lib/api/hooks/locations/useLocationUpdate";
import {useLocationById} from "../../../lib/api/hooks/locations/useLocationById";
import {useEffect} from "react";

const {useForm} = Form;
const CreateLocation: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {id} = router.query;
    const {location, refresh} = useLocationById(id);
    const {mutate, isLoading} = useLocationUpdate();
    useEffect(() => {
        if (id) {
            refresh(id)
        }
    }, [id])
    useEffect(() => {
        if (location) {
            form.setFieldsValue(location);
        }
    }, [location])
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
                            notification.success({message: 'Location Updated'});
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
