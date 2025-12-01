import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Radio, Space, Typography, Button, message } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const AccessModal = ({ visible, doctor, onGrant, onCancel }) => {
  const [accessType, setAccessType] = useState('limited');
  const [loading, setLoading] = useState(false);

  const handleGrant = async () => {
    setLoading(true);
    try {
      await onGrant(accessType);
    } catch (error) {
      message.error('Failed to grant access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="grant" type="primary" loading={loading} onClick={handleGrant}>
          Grant Access
        </Button>,
      ]}
      width={550}
    >
      <Title level={4}>Grant Access to {doctor?.name}</Title>
      <Paragraph type="secondary">
        Specialization: {doctor?.specialization}
      </Paragraph>

      <Radio.Group
        onChange={(e) => setAccessType(e.target.value)}
        value={accessType}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Radio value="limited" style={{ width: '100%' }}>
            <Space direction="vertical" size="small" style={{ marginLeft: 8 }}>
              <Text strong>
                <LockOutlined /> Limited Access (Recommended)
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Only files related to {doctor?.specialization} and relevant diagnostics
              </Text>
              <Text type="success" style={{ fontSize: '12px' }}>
                ✓ Best for specialist consultations
              </Text>
            </Space>
          </Radio>

          <Radio value="complete" style={{ width: '100%' }}>
            <Space direction="vertical" size="small" style={{ marginLeft: 8 }}>
              <Text strong>
                <UnlockOutlined /> Complete Access
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                All your medical records without restrictions
              </Text>
              <Text type="warning" style={{ fontSize: '12px' }}>
                ⚠ Recommended only for primary care physicians
              </Text>
            </Space>
          </Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

AccessModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  doctor: PropTypes.shape({
    name: PropTypes.string,
    specialization: PropTypes.string,
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }),
  onGrant: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AccessModal;
