import type {NextPage} from 'next'
import styles from '../../../../styles/Users.module.scss';
import {Button, Card, Form, Input, notification, Radio, Select, Space, Tooltip} from "antd";
import {useRouter} from "next/router";

import {useEffect, useState} from "react";
import {useSearchSchoolByUDISE} from "../../../../lib/api/hooks/schools/useSearchSchoolByUdise";
import {ApplicationId} from "../../../../components/esamaad-application";
import {CheckCircleFilled} from "@ant-design/icons";
import {useUserById} from "../../../../lib/api/hooks/users/useUserById";
import {esamvaadDesignations} from "../../../../lib/esamvaad-designations";
import {useUserUpdateById} from "../../../../lib/api/hooks/users/useUserUpdateById";
import {useUserByIdFromHasura} from "../../../../lib/api/hooks/users/useUserByIdFromHasura";
import {useUserCreate} from "../../../../lib/api/hooks/users/useUserCreate";

const {useForm} = Form;
const EditUser: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useUserUpdateById();
    const {changePassword, isLoading: changingPassword} = useUserCreate();
    const [formTypes, setFormTypes] = useState([] as string[]);
    const [designation, setDesignation] = useState('' as string);
    const [udise, setUDISE] = useState('' as string);
    const {id} = router.query;

    const {user, refresh, isLoading: _fetchLoading} = useUserById(ApplicationId, {
        'id': router.query.id
    });
    const {
        user: userFromHasura,
        refresh: refreshHasura,
        isLoading: loadingHasura
    } = useUserByIdFromHasura(router.query.id as string);
    const {school, refresh: fetchSchool} = useSearchSchoolByUDISE();

    const schoolMode = formTypes?.length == 1 && formTypes?.[0] === 'school';
    useEffect(() => {
        if (user) {
            const _reg = user?.registrations?.find((a: any) => a.applicationId === ApplicationId);
            form.setFieldsValue({...user, user: {...user, roles: _reg?.roles || []}});
            setFormTypes(_reg?.roles);
            setUDISE(user?.data?.udise);
            refreshHasura(id);
        }
    }, [user])
    useEffect(() => {
        if (userFromHasura) {
            form.setFieldsValue({
                employment: userFromHasura.employment,
                account_status: userFromHasura.account_status,
                designation: userFromHasura.designation
            });
            setDesignation(userFromHasura.designation);
        }
    }, [userFromHasura]);
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
                        const _v :any= {
                            user: {
                                mobilePhone: values['user']['mobilePhone'],
                                firstName: values['user']['fullName'],
                                fullName: values['user']['fullName'],
                                data: {
                                    phone: values['user']['mobilePhone'],
                                    accountName: values['user']['fullName'],
                                    school: school.id,
                                    udise: school.udise,
                                }
                            },
                            designation: values.designation,
                            account_status: values.account_status,
                            employment: values.employment,
                        }
                        _v['gql'] = {
                            designation: _v.designation,
                            cadre: _v.designation,
                            school_id: school.id,
                            account_status: _v.account_status,
                            employment: _v.employment,
                        };
                        console.log(school);
                        mutate(id, _v, (data: any) => {
                            notification.success({message: 'User Updated'});
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
                                name={['designation']}>
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
                                name={['employment']}>
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
                                label={'Account Status'}
                                name={['account_status']}>
                                <Radio.Group>
                                    <Space direction="vertical">
                                        {
                                            ['ACTIVE', 'DEACTIVATED', 'PENDING', 'REJECTED'].map((status: string) => {
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

                    <Form.Item>
                        <Button type={'primary'} color={'yellow'} loading={changingPassword} onClick={() => {
                            changePassword({
                                "loginId": user.username,
                                "password": "himachal12345"
                            }, () => notification.success({message: "Password Changed Successfully"}))
                        }}>Change Password</Button>
                    </Form.Item>

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
                            <Button htmlType={'submit'} type={'primary'} disabled={!school} loading={isLoading}>
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
