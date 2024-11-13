import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Col, Row, Card, Grid, Typography, Modal, Spin, Input, message } from 'antd';
import { FilePdfOutlined, FileTextOutlined, EyeOutlined, FileImageOutlined, FileWordOutlined, FileExcelOutlined, FilePptOutlined, FileUnknownOutlined } from '@ant-design/icons';

import ContentLayout from '@components/ContentLayout';
import FileUpload from '@components/FileUpload';
import useContract from '@hooks/useContract';
import useCustomState from '@hooks/useCustomState';
import { pinata } from '@services/pinata';
import { getFileCategory } from '@utils/fileType';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const RecordList = ({ patientAddress }) => {
  const contract = useContract();
  const [state, updateState] = useCustomState({
    records: [],
    filteredRecords: [],
    fileList: [],
    selectedRecord: null,
    isSelectedRecordModalVisible: false,
    isDescriptionModalVisible: false,
    description: '',
    isLoading: true,
    isUploading: false,
  });
  const screens = useBreakpoint();

  const fetchRecords = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const records = await contract.getMedicalRecords(patientAddress);
      const recordsInfo = await Promise.all(
        records.map(async (record) => ({
          filename: record[0],
          description: record[1],
          fileFormat: record[2],
          fileSize: record[3],
          createdAt: record[4],
          createdBy: record[5],
          cid: record[6],
        }))
      );
      const formattedRecords = recordsInfo.map((record, index) => ({
        key: index,
        title: record.filename,
        description: record.description,
        date: new Date(Number(record.createdAt) * 1000).toLocaleDateString(),
        uploadedBy: record.createdBy,
        type: record.fileFormat,
        fileUrl: pinata.getIPFSUrl(record.cid),
      }));
      updateState({ records: formattedRecords, isLoading: false });
    } catch (error) {
      console.error(error);
      message.error('Error fetching records');
      updateState({ isLoading: false });
    }
  }, [contract]);

  const getModalContent = (record) => {
    switch (getFileCategory(record?.type)) {
      case 'text':
      case 'pdf':
      case 'word':
      case 'excel':
      case 'ppt':
        return (
          <iframe
            src={record.fileUrl}
            style={{ width: '100%', height: '500px', border: 0 }}
            title={record.title}
          />
        );
      case 'image':
        return (
          <img
            src={record.fileUrl}
            alt={record.title}
            style={{ width: '100%', height: 'auto' }}
          />
        );
      default:
        return null;
    }
  };

  const getRecordIcon = (type) => {
    const category = getFileCategory(type);
    switch (category) {
      case 'text':
        return <FileTextOutlined style={{ fontSize: 32, color: '#40a9ff' }} />;
      case 'image':
        return <FileImageOutlined style={{ fontSize: 32, color: '#52c41a' }} />;
      case 'pdf':
        return <FilePdfOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />;
      case 'word':
        return <FileWordOutlined style={{ fontSize: 32, color: '#1890ff' }} />;
      case 'excel':
        return <FileExcelOutlined style={{ fontSize: 32, color: '#52c41a' }} />;
      case 'ppt':
        return <FilePptOutlined style={{ fontSize: 32, color: '#fa8c16' }} />;
      default:
        return <FileUnknownOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />;
    }
  };

  const onFileUpload = async () => {
    updateState({
      isUploading: true,
      isDescriptionModalVisible: true,
    })
  };

  const handleDescriptionSubmit = async () => {
    updateState({ isDescriptionModalVisible: false });
    try {
      const file = state.fileList[0];
      const hash = await pinata.uploadToIPFS(file);
      const tx = await contract.addMedicalRecord(
        patientAddress,
        file.name,
        state.description,
        file.type,
        String(file.size),
        hash
      );
      await tx.wait();
      message.success('File uploaded successfully');
      updateState({ fileList: [], description: '', isUploading: false });
      await fetchRecords();
    } catch (error) {
      console.error(error);
      message.error('Error uploading file');
      updateState({ isUploading: false });
    }
  };

  const handleShowContent = (record) => {
    updateState({ selectedRecord: record, isSelectedRecordModalVisible : true });
  };

  const handleCloseModal = () => {
    updateState({ isSelectedRecordModalVisible : false, selectedRecord: null });
  };

  useEffect(() => {
    fetchRecords();
  }, [contract, fetchRecords]);

  return (
    <>
      <FileUpload state={state} updateState={updateState} onUpload={onFileUpload}/>
      <Col span={24}>
        {state.isLoading ? (
          <Spin size='large' fullscreen={true} />
        ) : (
          <Card bordered={true}>
            <Title level={4} style={{ marginBottom: 20 }}>
              Patient Medical Records
            </Title>
              <List
                itemLayout={screens.xs ? 'vertical' : 'horizontal'}
                dataSource={state.records}
                renderItem={(record) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getRecordIcon(record.type)}
                      title={
                        <span style={{ fontSize: screens.xs ? '14px' : '15px', fontWeight: 'bold' }}>
                          {record.title}
                        </span>
                      }
                      description={
                        <span style={{ fontSize: screens.xs ? '12px' : '13px' }}>
                          Date: {record.date} 
                          <br />
                          Uploaded By: {record.uploadedBy}
                        </span>
                      }
                    />
                    <Row gutter={16} justify='center'>
                      <Col>
                        <Button
                          key={record.key}
                          type='primary'
                          icon={<EyeOutlined />}
                          onClick={() => handleShowContent(record)}
                          size={screens.xs ? 'middle' : 'large'}
                        >
                          View
                        </Button>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
          </Card>
        )}
      </Col>
      <Modal
        title='Enter File Description'
        open={state.isDescriptionModalVisible}
        onOk={handleDescriptionSubmit}
        onCancel={() => updateState({ isDescriptionModalVisible: false, uploadingFile: null })}
      >
        <Input.TextArea
          placeholder='Description of the file'
          value={state.description}
          onChange={(e) => updateState({ description: e.target.value })}
          rows={4}
        />
      </Modal>
      <Modal
        title={state.selectedRecord?.title}
        open={state.isSelectedRecordModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={screens.xs ? '90%' : '70%'}
      >
        <Typography>
          <Text strong>Description: </Text>{state.selectedRecord?.description}
          <br />
          <Text strong>Date: </Text>{state.selectedRecord?.date}
          <br />
          <Text strong>Uploaded By: </Text>{state.selectedRecord?.uploadedBy}
        </Typography>
        {getModalContent(state.selectedRecord)}
      </Modal>
    </>
  );
};

RecordList.propTypes = {
    patientAddress: PropTypes.string.isRequired,
};

export default RecordList;
