import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, message } from 'antd';

const { Paragraph } = Typography;

const KeyModal = ({ publicKey, privateKey = null }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied to clipboard');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <Button
        variant='outlined'
        onClick={() => setIsModalVisible(true)}
        size='small'
      >
        {privateKey ? 'View Keys' : 'View Key'}
      </Button>
      <Modal
        title={privateKey ? "Public & Private Keys" : "Public Key"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={565}
      >
        <p><strong>Public Key:</strong></p>
        <Paragraph
          style={{
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 5,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
          onClick={() => copyToClipboard(publicKey)}
        >
          {publicKey}
        </Paragraph>
        {
          privateKey && (
            <>
              <p><strong>Private Key:</strong></p>
              <Paragraph
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 10,
                  borderRadius: 5,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
                onClick={() => copyToClipboard(privateKey)}
              >
                {privateKey}
              </Paragraph>
            </>
          )
        }
      </Modal>
    </>
  );
};

KeyModal.propTypes = {
    publicKey: PropTypes.string.isRequired,
    privateKey: PropTypes.string,
};

export default KeyModal;
