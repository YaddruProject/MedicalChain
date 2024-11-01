import PropTypes from 'prop-types';
import { Upload, Typography, message, Button, Flex, Grid } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { getFileCategory } from '@utils/fileType';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const FileUpload = ({ state, updateState, onUpload }) => {
    const screens = useBreakpoint();

    const beforeUpload = (file) => {
        const isValidFileType = getFileCategory(file?.type);
        if (!isValidFileType) {
            message.error('Unsupported file type');
            return Upload.LIST_IGNORE;
        }
        updateState({ fileList: [file] });
        return false;
    };

    const clearFile = () => {
        updateState({ fileList: [] });
    };

    return (
        <Flex justify='center' style={{ marginBottom: 15 }}>
            <Flex gap='small' justify='center'>
                <Upload
                    name='file'
                    fileList={state.fileList}
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                >
                    <Button
                        icon={<UploadOutlined />}
                        block
                        size={screens.xs ? 'middle' : 'large'}
                    >
                        Select File
                    </Button>
                </Upload>
                <Button
                    type='primary'
                    onClick={() => onUpload(state.fileList)}
                    disabled={state.fileList.length === 0}
                    loading={state.isUploading}
                    block
                    size={screens.xs ? 'middle' : 'large'}
                >
                    Upload File
                </Button>
            </Flex>
            {state.fileList.length > 0 && (
                <Flex justify='center' align='center'>
                    <Text strong>Selected File:</Text><Text>&nbsp;{state.fileList[0].name}</Text>
                    <Button type='link' onClick={clearFile}>
                        Clear
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

FileUpload.propTypes = {
    state: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
};

export default FileUpload;
