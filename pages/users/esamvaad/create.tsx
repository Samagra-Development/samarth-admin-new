import type {NextPage} from 'next'
import styles from '../../../styles/Users.module.scss';
import {Button, Card, Col, Form, Input, notification, Radio, Row, Select, Space, Tooltip} from "antd";
import {useRouter} from "next/router";
import {useUserCreate} from "../../../lib/api/hooks/users/useUserCreate";
import {ApplicationId} from "./application";
import {log} from "util";
import {useEffect, useState} from "react";
import {designationLevels} from "../../../components/designation-level";
import {useSearchSchoolByUDISE} from "../../../lib/api/hooks/schools/useSearchSchoolByUdise";
import {CheckCircleFilled} from "@ant-design/icons";

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
                        values = JSON.parse(JSON.stringify({...values, registration: values.user}));
                        values['registration']['applicationId'] = ApplicationId;
                        if (!school) {
                            notification.error({message: "School not found with this UDISE"});
                            return;
                        }
                        values['user']['data']['school'] = school.id;
                        delete values['user']['roles'];
                        delete values['registration']['mobilePhone'];
                        delete values['registration']['email'];
                        delete values['registration']['firstName'];
                        delete values['registration']['data'];
                        console.log(values);

                        mutate(values, (data: any) => {
                            // router.back();
                        });
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
                        name={['user', 'firstName']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Mobile'}
                        rules={[{required: true, message: 'Required'}]}

                        name={['user', 'mobilePhone']}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={'Email'}
                        rules={[{required: true,type:"email", message: 'Required'}]}

                        name={['user', 'email']}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Roles'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'roles']}>
                        <Select
                            mode="tags"
                            placeholder="Please select"
                            style={{width: '100%'}}
                            onChange={(a: any) => setFormTypes(a)}
                        >
                            {
                                ['Principal', 'Teacher', 'school'].map((o) => {
                                    return <Select.Option key={o} value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    {
                        formTypes?.indexOf('Principal') > -1 && <>
                            <Form.Item
                                label={'Designation'}
                                name={['user', 'designation']}>
                                <Select
                                    placeholder="Please select"
                                    style={{width: '100%'}}
                                    onChange={(a: any) => setDesignation(a)}
                                >
                                    {
                                        designationLevels.map((o) => {
                                            return <Select.Option key={o.designation}
                                                                  value={o.designation}>{o.designation}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={'Mode Of Employment'}
                                name={['user', 'data', 'modeOfEmployment']}>
                                <Radio.Group>
                                    <Space direction="vertical">
                                        {
                                            ['Permanent', 'Contractual'].map((status: string) => {
                                                return <Radio key={status} value={status}>{status}</Radio>
                                            })
                                        }
                                    </Space>
                                </Radio.Group>
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
                        </>
                    }
                    <Form.Item
                        label={'Password'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'password']}>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'School UDISE'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'data', 'udise']}>
                        <Input.Group style={{width: '100%'}}>
                            <Row style={{width: '100%'}}>
                                <Col flex={'auto'}>
                                    <Input onChange={(e: any) => setUDISE(e.target.value)}/>
                                </Col>
                                {
                                    school && <Col>
                                        <Tooltip title={`School: ${school.name}`}>
                                            <Button icon={<CheckCircleFilled/>} style={{color: 'green'}}/>
                                        </Tooltip>
                                    </Col>
                                }
                            </Row>
                        </Input.Group>
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
