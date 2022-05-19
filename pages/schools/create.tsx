import type {NextPage} from 'next'
import styles from '../../styles/Users.module.scss';
import {Button, Card, Col, Form, Input, notification, Radio, Row, Select, Space, Tooltip} from "antd";
import {useRouter} from "next/router";
import {log} from "util";
import {useEffect, useState} from "react";
import {CheckCircleFilled} from "@ant-design/icons";
import {useUserCreate} from "../../lib/api/hooks/users/useUserCreate";
import {useSearchSchoolByUDISE} from "../../lib/api/hooks/schools/useSearchSchoolByUdise";

const {useForm} = Form;
const CreateUser: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useUserCreate();
    const [formTypes, setFormTypes] = useState([] as string[]);
    const [designation, setDesignation] = useState('' as string);
    const [udise, setUDISE] = useState('' as string);
    const {applicationSlug} = router.query;
    // const [school, setSchool] = useState(null as any);
    const {school, refresh: fetchSchool} = useSearchSchoolByUDISE();
    useEffect(() => {
        fetchSchool(udise);
        if (udise) {
            // useSearchUdise(udise);
        } else {
            // setSchool(null)
        }
    }, [udise])
    return (
        <div className={styles.formWrapper}>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    style={{maxWidth: '400px'}}
                    initialValues={{
                        user: {
                            roles: ['school']
                        }
                    }}
                    onFinish={(values: any) => {
                        // values = JSON.parse(JSON.stringify({...values,}));
                        // values['registration'] = {
                        //     ['applicationId']: ApplicationId,
                        //     "username": values['user']['username'],
                        //     "roles": values['user']['roles'],
                        // };
                        // if (!school) {
                        //     notification.error({message: "School not found with this UDISE"});
                        //     return;
                        // }
                        // values['user']['data']['school'] = school.id;
                        // values['user']['password'] = 'himachal12345';
                        // values['user']['data']['phone'] = values['user']['mobilePhone'];
                        // values['user']['data']['accountName'] = values['user']['fullName'];
                        // delete values['user']['roles'];
                        //
                        // mutate(values, (data: any) => {
                        //     notification.success({message: 'User Added'});
                        //     router.back();
                        // });
                    }}>

                    <Form.Item
                        label={'Username'}
                        rules={[{required: true, message: 'Username Required'}]}

                        name={['user', 'username']}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Name'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'fullName']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Mobile'}
                        rules={[{required: true, message: 'Required'}]}

                        name={['user', 'mobilePhone']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Roles'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'roles']}>
                        <Select
                            mode="tags"
                            disabled={true}
                            placeholder="Please select"
                            style={{width: '100%'}}
                            onChange={(a: any) => setFormTypes(a)}
                        >
                            {
                                ['Teacher', 'Principal', 'school'].map((o) => {
                                    return <Select.Option key={o} value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label={<Space>School UDISE {school && <Tooltip title={`School: ${school.name}`}>
                            <CheckCircleFilled style={{color: 'green'}}/>
                        </Tooltip>}</Space>}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'data', 'udise']}>
                        <Input onChange={(e: any) => setUDISE(e.target.value)}/>
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
