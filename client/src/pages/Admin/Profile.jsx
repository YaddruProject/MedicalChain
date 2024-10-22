import { useCallback, useEffect } from 'react';
import { Col, Button, Form, Input, Modal, message, Spin } from 'antd';

import ContentLayout from '@components/ContentLayout';
import AvatarUpload from '@components/AvatarUpload';
import ProfileCard from '@components/ProfileCard';
import useContract from '@hooks/useContract';
import useCustomState from '@hooks/useCustomState';
import { pinata } from '@services/pinata';

const Profile = () => {
  const contract = useContract();
  const [form] = Form.useForm();
  const [state, updateState] = useCustomState({
    isModalVisible: false,
    adminData: null,
    items: [],
    fileList: [],
    isSubmitting: false,
    isLoading: true,
  });

  const fetchAdminData = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const data = await contract.getAdminInfo();
      const adminInfo = {
        address: data[0],
        name: data[1],
        email: data[2],
        contactNumber: data[3],
        hash: data[4],
      };
      const avatarUrl = adminInfo.hash ? pinata.getIPFSUrl(adminInfo.hash) : 'https://example.com/default-avatar.png';
      adminInfo.avatarUrl = avatarUrl;
      updateState({
        adminData: adminInfo,
        items: [
          { key: 1, label: 'Address', children: adminInfo.address },
          { key: 2, label: 'Name', children: adminInfo.name },
          { key: 3, label: 'Email', children: adminInfo.email },
          { key: 4, label: 'Contact Number', children: adminInfo.contactNumber },
        ],
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      message.error('Error fetching admin data');
      updateState({ isLoading: false });
    }
  }, [contract]);

  const showModal = () => {
    updateState({ isModalVisible: true });
    form.setFieldsValue({
      name: state.adminData?.name,
      email: state.adminData?.email,
      contactNumber: state.adminData?.contactNumber,
    });
  };

  const handleCancel = () => {
    updateState({ isModalVisible: false });
  };

  const onFormFinish = async (values) => {
    updateState({ isSubmitting: true });
    const { name, email, contactNumber } = values;
    let hash = state.adminData.hash;
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
      const tx = await contract.updateAdminInfo(name, email, contactNumber, hash);
      await tx.wait();
      await fetchAdminData();
      updateState({ isModalVisible: false, fileList: [], isSubmitting: false });
      message.success('Admin info updated successfully');
    } catch (error) {
      console.error(error);
      message.error('Error updating admin info');
      updateState({ isSubmitting: false });
    }
  };

  const onFormFinishFailed = (errorInfo) => {
    message.error('Failed to update admin info');
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    fetchAdminData();
  }, [contract, fetchAdminData]);

  return (
    <ContentLayout>
      <Col span={24}>
        {state.isLoading ? (
            <Spin size='large' fullscreen={true} />
          ) : (
            <ProfileCard
              title='Admin Profile'
              items={state.items}
              avatarUrl={state.adminData.avatarUrl}
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
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder='Enter your name' />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address.' },
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
