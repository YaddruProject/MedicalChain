import PropTypes from 'prop-types';
import { Avatar, Upload, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AvatarUpload = ({ state, updateState }) => {
    const uploadButton = (
        <button
          style={{ border: 0, background: 'none' }}
          type='button'
        >
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>
            <Text>Upload</Text>
          </div>
        </button>
    );
    
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
          updateState({ fileList: [] });
        }
        return isJpgOrPng;
      };
    
      const handleChange = (info) => {
        if (info.file.originFileObj) {
          updateState({ fileList: info.fileList });
        }
      };

    return (
        <Upload
            name='avatar'
            fileList={state.fileList}
            listType='picture-circle'
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            customRequest={() => {}}
            >
            {state.fileList.length > 0 ? (
                <Avatar src={URL.createObjectURL(state.fileList[0].originFileObj)} size={100} />
            ) : (
                uploadButton
            )}
        </Upload>
    )
};

AvatarUpload.propTypes = {
    state: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
};

export default AvatarUpload;
