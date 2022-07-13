import type {NextPage} from 'next'
import styles from '../../../styles/Users.module.scss';
import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    notification,
    Select,
    Space,
} from "antd";
import {useRouter} from "next/router";
import {useSchoolCreate} from "../../../lib/api/hooks/schools/useSchoolCreate";
import {useLocations} from "../../../lib/api/hooks/locations/useLocations";
import {useEffect} from "react";
import {useSchoolById} from "../../../lib/api/hooks/schools/useSchoolById";

const {useForm} = Form;
const CreateSchool: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate,update, isLoading} = useSchoolCreate();
    const {locations} = useLocations({numberOfResults: 1000});
    const {id} = router.query;
    const {school, refresh} = useSchoolById(id);

    useEffect(() => {
        if (id) {
            refresh(id)
        }
    }, [id])
    useEffect(() => {
        if (school) {
            form.setFieldsValue(school);
        }
    }, [school])
    return (
        <div className={styles.formWrapper}>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    style={{maxWidth: '400px'}}
                    initialValues={{
                        is_active : false
                    }}
                    onFinish={(values: any) => {

                        mutate(values, (data: any) => {
                            notification.success({message: 'School Added'});
                            router.back();
                        });
                    }}>

                    <Form.Item
                        label={'UDISE'}
                        rules={[{required: true, message: 'UDISE Required'}]}

                        name={['udise']}>
                        <Input maxLength={10} minLength={10}/>
                    </Form.Item>


                    <Form.Item
                        label={'Name'}
                        rules={[{required: true, message: 'Name Required'}]}

                        name={['name']}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Type'}
                        rules={[{required: true, message: 'Type Required'}]}

                        name={['type']}>
                        <Select
                            placeholder="Please select"
                            style={{width: '100%'}}
                        >
                            {
                                ['GPS', 'GMS','GHS','GSSS'].map((o) => {
                                    return <Select.Option key={o}
                                                          value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={'Session'}
                        rules={[{required: true, message: 'Session Required'}]}

                        name={['session']}>
                        <Select
                            placeholder="Please select"
                            style={{width: '100%'}}
                        >
                            {
                                ['W', 'S'].map((o) => {
                                    return <Select.Option key={o}
                                                          value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        rules={[{required: true, message: 'Is Active Required'}]}
                        name={['is_active']} valuePropName="checked" >
                        <Checkbox >Is Active</Checkbox>
                    </Form.Item>


                    <Form.Item
                        label={'Location'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['location_id']}>
                        <Select
                            showSearch={true}
                            placeholder="Please select"
                            style={{width: '100%'}}
                            filterOption={(input, option) => {
                                return (option!.children?.join(',') as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }}
                        >
                            {
                                locations.map((o) => {
                                    return <Select.Option key={o.id}
                                                          value={o.id}>{o.district}/{o.block}/{o.cluster}</Select.Option>
                                })
                            }
                        </Select>
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

export default CreateSchool
