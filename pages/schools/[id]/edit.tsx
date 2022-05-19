import type {NextPage} from 'next'
import styles from '../../../styles/Users.module.scss';
import {Button, Card, Form, Input, notification, Radio, Select, Space, Tooltip} from "antd";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {CheckCircleFilled} from "@ant-design/icons";
import {useUserUpdateById} from "../../../lib/api/hooks/users/useUserUpdateById";
import {useUserById} from "../../../lib/api/hooks/users/useUserById";
import {ApplicationId} from "../../../components/esamaad-application";
import {useSearchSchoolByUDISE} from "../../../lib/api/hooks/schools/useSearchSchoolByUdise";
import {esamvaadDesignations} from "../../../lib/esamvaad-designations";

const {useForm} = Form;
const EditUser: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useUserUpdateById();
    const [formTypes, setFormTypes] = useState([] as string[]);
    const [designation, setDesignation] = useState('' as string);
    const [udise, setUDISE] = useState('' as string);
    const {id} = router.query;

    const {user, refresh, isLoading: _fetchLoading} = useUserById(ApplicationId, {
        'id': router.query.id
    });
    const {school, refresh: fetchSchool} = useSearchSchoolByUDISE();

    const schoolMode = formTypes?.length == 1 && formTypes?.[0] === 'school';
    useEffect(() => {
        if (user) {
            const _reg = user?.registrations?.find((a: any) => a.applicationId === ApplicationId);
            form.setFieldsValue({...user, user: {...user, roles: _reg?.roles || []}});
            setFormTypes(_reg?.roles);
            setUDISE(user?.data?.udise);

        }
    }, [user])
    useEffect(() => {
        if (id) {
            refresh(ApplicationId, {
                'id': id
            })
        }
    }, [id])
    // const [school, setSchool] = useState(null as any);
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
                        const _v = {
                            user: {
                                mobilePhone: values['user']['mobilePhone'],
                                fullName: values['user']['fullName'],
                                data: {
                                    phone: values['user']['mobilePhone'],
                                    accountName: values['user']['fullName'],
                                }
                            }
                        }
                        mutate(id, _v, (data: any) => {
                            notification.success({message: 'User Added'});
                            router.back();
                        });
                    }}>

                    <Form.Item
                        label={'Username'}
                        rules={[{required: true, message: 'Username Required'}]}

                        name={['user', 'username']}>
                        <Input disabled={true}/>
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
                                ['school'].map((o) => {
                                    return <Select.Option key={o} value={o}>{o}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    {
                        !schoolMode && <>
                            <Form.Item
                                label={'Designation'}
                                name={['user', 'designation']}>
                                <Select
                                    placeholder="Please select"
                                    style={{width: '100%'}}
                                    onChange={(a: any) => setDesignation(a)}
                                >
                                    {
                                        esamvaadDesignations.map((o) => {
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
                                            ['PERMANENT', 'CONTRACTUAL'].map((status: string) => {
                                                return <Radio key={status} value={status}>{status}</Radio>
                                            })
                                        }
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    }

                    <Form.Item
                        label={<Space>School UDISE {school && <Tooltip title={`School: ${school.name}`}>
                            <CheckCircleFilled style={{color: 'green'}}/>
                        </Tooltip>}</Space>}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'data', 'udise']}>
                        <Input disabled={schoolMode} onChange={(e: any) => setUDISE(e.target.value)}/>
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
