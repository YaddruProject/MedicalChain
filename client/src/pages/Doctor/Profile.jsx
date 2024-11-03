import { useCallback, useEffect } from 'react';
import { Col, Button, Form, Input, Modal, message, Spin } from 'antd';

import ContentLayout from '@components/ContentLayout';
import AvatarUpload from '@components/AvatarUpload';
import ProfileCard from '@components/ProfileCard';
import useContract from '@hooks/useContract';
import useUser from '@hooks/useUser';
import useCustomState from '@hooks/useCustomState';
import { pinata } from '@services/pinata';

const Profile = () => {
  const user = useUser();
  const contract = useContract();
  const [form] = Form.useForm();
  const [state, updateState] = useCustomState({
    isModalVisible: false,
    doctorData: null,
    items: [],
    fileList: [],
    isSubmitting: false,
    isLoading: true,
  });

  const fetchDoctorData = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const data = await contract.getDoctorInfo(user.address);
      const doctorData = {
        address: data[0],
        name: data[1],
        age: Number(data[2]),
        gender: data[3],
        email: data[4],
        contactNumber: data[5],
        currentWorkingHospital: data[6],
        specialization: data[7],
        hash: data[8],
      };
      const avatarUrl = doctorData.hash ? await pinata.getIPFSUrl(doctorData.hash) : 'https://example.com/default-avatar.png';
      doctorData.avatarUrl = avatarUrl;
      updateState({
        doctorData: doctorData,
        items: [
          { key: 1, label: 'Address', children: doctorData.address },
          { key: 2, label: 'Name', children: doctorData.name },
          { key: 3, label: 'Age', children: doctorData.age },
          { key: 4, label: 'Gender', children: doctorData.gender },
          { key: 5, label: 'Email', children: doctorData.email },
          { key: 6, label: 'Contact Number', children: doctorData.contactNumber },
          { key: 7, label: 'Current Working Hospital', children: doctorData.currentWorkingHospital },
          { key: 8, label: 'Specialization', children: doctorData.specialization },
        ],
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      message.error('Error fetching doctor data');
      updateState({ isLoading: false });
    }
  }, [contract]);

  const showModal = () => {
    updateState({ isModalVisible: true });
    form.setFieldsValue({
      age: state.doctorData.age,
      email: state.doctorData.email,
      contactNumber: state.doctorData.contactNumber,
      currentWorkingHospital: state.doctorData.currentWorkingHospital,
      specialization: state.doctorData.specialization,
    });
  };

  const handleCancel = () => {
    updateState({ isModalVisible: false });
  };

  const onFormFinish = async (values) => {
    updateState({ isSubmitting: true });
    const { age, email, contactNumber, currentWorkingHospital, specialization } = values;
    let hash = state.doctorData.hash;
    if (state.fileList.length > 0) {
      try {
        hash = await pinata.uploadToIPFS(state.fileList[0].originFileObj);
      } catch (error) {
        message.error('Error uploading to IPFS');
        updateState({ isSubmitting: false });
        return;
      }
    }
    try {
      const tx = await contract.updateDoctorInfo(
        user.address,
        age,
        email,
        contactNumber,
        currentWorkingHospital,
        specialization,
        hash
      );
      await tx.wait();
      await fetchDoctorData();
      updateState({ isModalVisible: false, fileList: [], isSubmitting: false });
      message.success('Doctor info updated successfully');
    } catch (error) {
      console.error(error);
      message.error('Error updating doctor info');
      updateState({ isSubmitting: false });
    }
  };

  const onFormFinishFailed = (errorInfo) => {
    message.error('Failed to update doctor info');
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    fetchDoctorData();
  }, [contract, fetchDoctorData]);

  return (
    <ContentLayout>
      <Col span={24}>
        {state.isLoading ? (
            <Spin size='large' fullscreen={true} />
          ) : (
            <ProfileCard
              title='Doctor Profile'
              items={state.items}
              avatarUrl={state.doctorData.avatarUrl}
              onEdit={showModal}
            />
          )}
      </Col>
      <Modal
        title='Edit Profile'
        open={state.isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name='basic'
          layout='vertical'
          onFinish={onFormFinish}
          onFinishFailed={onFormFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Profile Picture'
            name='avatar'
            style={{ textAlign: 'center' }}
          >
            <AvatarUpload state={state} updateState={updateState} />
          </Form.Item>
          <Form.Item
            label='Age'
            name='age'
            rules={[{ required: true, message: 'Please input your age!' }]}
          >
            <Input placeholder='Enter your age' />            
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder='Enter your email' />
          </Form.Item>
          <Form.Item
            label='Contact Number'
            name='contactNumber'
            rules={[
              { required: true, message: 'Please input your contact number!' },
              { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit contact number.' },
            ]}
          >
            <Input placeholder='Enter your contact number' />
          </Form.Item>
          <Form.Item
            label='Current Working Hospital'
            name='currentWorkingHospital'
            rules={[{ required: true, message: 'Please input your current working hospital!' }]}
          >
            <Input placeholder='Enter your current working hospital' />
          </Form.Item>
          <Form.Item
            label='Specialization'
            name='specialization'
            rules={[{ required: true, message: 'Please input your specialization!' }]}
          >
            <Input placeholder='Enter your specialization' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={state.isSubmitting}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ContentLayout>
  );
};

export default Profile;
