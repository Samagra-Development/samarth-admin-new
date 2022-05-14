import type {NextPage} from 'next'
import styles from '../../../../styles/Users.module.scss';
import {Button, Card, Form, Input, notification, Radio, Select, Skeleton, Space, Tooltip} from "antd";
import {router} from "next/client";
import {useRouter} from "next/router";
import {useUserCreate} from "../../../../lib/api/hooks/users/useUserCreate";
import {Applications, useUsers} from "../../../../lib/api/hooks/users/useUsers";
import {useEffect, useState} from "react";
import {useSearchSchoolByUDISE} from "../../../../lib/api/hooks/schools/useSearchSchoolByUdise";
import {ApplicationId} from "../../../../components/esamaad-application";
import {designationLevels, getLevelFromDesignation} from "../../../../components/designation-level";
import {CheckCircleFilled} from "@ant-design/icons";
import {getAllDistricts, getBlocks, getClusters, getVisibility} from "../../../../components/district-block-cluster";
import {useUserById} from "../../../../lib/api/hooks/users/useUserById";

const {useForm} = Form;
const EditUser: NextPage = () => {
    const [form] = useForm();
    const router = useRouter();
    const {mutate, isLoading} = useUserCreate();
    const [formTypes, setFormTypes] = useState([] as string[]);
    const [designation, setDesignation] = useState('' as string);
    const [district, setDistrict] = useState('' as string);
    const [block, setBlock] = useState('' as string);
    const [cluster, setCluster] = useState('' as string);
    const {id} = router.query;

    const {user, refresh, isLoading: _fetchLoading} = useUserById(ApplicationId, {
        'id': router.query.id
    });
    useEffect(() => {
        if (user) {
            console.log({...user, user: user});
            console.log('===');
            form.setFieldsValue({...user, user: user});
            setDesignation(user?.data?.roleData?.designation);
            setTimeout(() => {
                form.setFieldsValue({['district']: user.district});
                setDistrict(user.district);
            }, 100);
            setTimeout(() => {
                form.setFieldsValue({['block']: user.block});
                setDistrict(user.block);
            }, 500);
            setTimeout(() => {
                form.setFieldsValue({['cluster']: user.cluster});
                setDistrict(user.cluster);
            }, 1000);
        }
    }, [user])
    useEffect(() => {
        if (id) {
            refresh(ApplicationId, {
                'id': id
            })
        }
    }, [id])
    useEffect(() => {
        form.setFieldsValue({['geographic_level']: getLevelFromDesignation(designation),});
        setDistrict('')
        form.setFieldsValue({['district']: '',});
    }, [designation])
    useEffect(() => {
        form.setFieldsValue({['block']: '',});
        setBlock('');
    }, [district])
    useEffect(() => {
        form.setFieldsValue({['cluster']: '',});
        setCluster('');
    }, [block])

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
                        values = JSON.parse(JSON.stringify({...values,}));
                        values['registration'] = {
                            ['applicationId']: ApplicationId,
                            "username": values['user']['username'],
                            "roles": [values['user']['data']['roleData']['designation']],
                        };
                        values['user']['password'] = '1234abcd';
                        values['user']['data']['phone'] = values['user']['mobilePhone'];
                        values['user']['data']['roleData']['geographic_level'] = values['geographic_level'];
                        values['user']['data']['roleData']['district'] = values['district'];
                        values['user']['data']['roleData']['block'] = values['block'];
                        values['user']['data']['roleData']['cluster'] = values['cluster'];
                        values['user']['data']['accountName'] = values['user']['fullName'];
                        delete values['geographic_level'];
                        delete values['district'];
                        delete values['block'];
                        delete values['cluster'];
                        delete values['user']['roles'];

                        console.log(values);
                        mutate(values, (data: any) => {
                            notification.success({message: 'User Added'});
                            router.back();
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
                        label={'Designation'}
                        rules={[{required: true, message: 'Required'}]}
                        name={['user', 'data', 'roleData', 'designation']}>
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
                    {
                        getVisibility(designation, 'District') && <Form.Item
                            label={'District'}
                            rules={[{required: true, message: 'District Required'}]}
                            name={['district']}>
                            <Select
                                placeholder="Please select"
                                style={{width: '100%'}}
                                onChange={(a: any) => setDistrict(a)}
                            >
                                {
                                    getAllDistricts().map((o) => {
                                        return <Select.Option key={o}
                                                              value={o}>{o}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    {
                        getVisibility(designation, 'Block') && district && <Form.Item
                            label={'Block'}
                            rules={[{required: true, message: 'Block Required'}]}
                            name={['block']}>
                            <Select
                                placeholder="Please select"
                                style={{width: '100%'}}
                                onChange={(a: any) => setBlock(a)}
                            >
                                {
                                    getBlocks(district).map((o) => {
                                        return <Select.Option key={o}
                                                              value={o}>{o}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    {
                        getVisibility(designation, 'Cluster') && district && block && <Form.Item
                            label={'Cluster'}
                            rules={[{required: true, message: 'Cluster Required'}]}
                            name={['cluster']}>
                            <Select
                                placeholder="Please select"
                                style={{width: '100%'}}
                                onChange={(a: any) => setCluster(a)}
                            >
                                {
                                    getClusters(block).map((o) => {
                                        return <Select.Option key={o}
                                                              value={o}>{o}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    <Form.Item
                        label={'Geographic Level'}
                        name={['geographic_level']}>
                        <Input disabled={true}/>
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
export default EditUser
