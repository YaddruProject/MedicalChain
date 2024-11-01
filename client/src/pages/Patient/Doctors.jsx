import { useEffect, useCallback } from 'react';
import { Input, Button, Col, Card, List, Typography, Avatar, Grid, Spin, Modal, message, Row } from 'antd';

import ContentLayout from '@components/ContentLayout';
import ProfileCard from '@components/ProfileCard';
import useContract from '@hooks/useContract';
import useCustomState from '@hooks/useCustomState';
import { pinata } from '@services/pinata';

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const Doctors = () => {
  const contract = useContract();
  const screens = useBreakpoint();
  const [state, updateState] = useCustomState({
    doctors: [],
    filteredDoctors: [],
    doctorsWithAccess: [],
    isModalVisible: false,
    selectedDoctor: null,
    isLoading: true,
  });

  const fetchAllDoctors = useCallback(async () => {
    updateState({ isLoading: true });
    try {
      const doctors = await contract.getAllDoctors();
      const doctorInfos = await Promise.all(
        doctors.map(async (doctor) => ({
          address: doctor[0],
          name: doctor[1],
          age: Number(doctor[2]),
          gender: doctor[3],
          email: doctor[4],
          contactNumber: doctor[5],
          currentWorkingHospital: doctor[6],
          specialization: doctor[7],
          photoUrl: pinata.getIPFSUrl(doctor[8]),
        }))
      );
      const doctorsWithAccess = await contract.listDoctorsWithAccess();
      updateState({
        doctors: doctorInfos,
        filteredDoctors: doctorInfos,
        doctorsWithAccess: doctorsWithAccess.map((address) =>
          doctorInfos.find((doctor) => doctor.address === address)
        ),
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      message.error('Error fetching doctors');
      updateState({ isLoading: false });
    }
  }, [contract]);

  const handleSearch = (value) => {
    const filtered = state.doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(value.toLowerCase()) ||
        doctor.currentWorkingHospital.toLowerCase().includes(value.toLowerCase())
    );
    updateState({ filteredDoctors: filtered });
  };

  const handleGrantAccess = async (doctor) => {
    try {
      const tx = await contract.grantAccessToDoctor(doctor.address);
      await tx.wait();
      updateState({ doctorsWithAccess: [...state.doctorsWithAccess, doctor] });
      message.success('Access granted for ' + doctor.name);
    } catch (error) {
      console.error(error);
      message.error('Error granting access to doctor ' + doctor.name);
    }
  };

  const handleRevokeAccess = async (doctor) => {
    try {
      const tx = await contract.revokeAccessFromDoctor(doctor.address);
      await tx.wait();
      updateState({
        doctorsWithAccess: state.doctorsWithAccess.filter((d) => d.address !== doctor.address),
      });
      message.success('Access revoked for ' + doctor.name);
    } catch (error) {
      console.error(error);
      message.error('Error revoking access from doctor ' + doctor.name);
    }
  };

  const isDoctorGrantedAccess = (doctorAddress) =>
    state.doctorsWithAccess.some((d) => d.address === doctorAddress);

  const showDoctorDetails = (doctor) => {
    updateState({ selectedDoctor: doctor, isModalVisible: true });
  };

  const handleCancelModal = () => {
    updateState({ isModalVisible: false, selectedDoctor: null });
  };

  useEffect(() => {
    fetchAllDoctors();
  }, [contract, fetchAllDoctors]);

  return (
    <ContentLayout>
      <Col span={24}>
        {state.isLoading ? (
          <Spin size='large' fullscreen={true} />
        ) : (
          <>
            {state.doctorsWithAccess.length > 0 && (
              <Card bordered style={{ marginBottom: 30 }}>
                <Title level={4} style={{ marginBottom: 20 }}>
                  Doctors with Access
                </Title>
                <List
                  itemLayout={screens.xs ? 'vertical' : 'horizontal'}
                  dataSource={state.doctorsWithAccess}
                  renderItem={(doctor) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={doctor.photoUrl} size={60} />}
                        title={
                          <span style={{ fontSize: screens.xs ? '14px' : '15px', fontWeight: 'bold' }}>
                            {doctor.name}
                          </span>
                        }
                        description={
                          <span style={{ fontSize: screens.xs ? '12px' : '13px' }}>
                            {doctor.specialization} at {doctor.currentWorkingHospital}
                          </span>
                        }
                      />
                      <Row justify='center' gutter={16} style={{ marginTop: screens.xs ? 15 : 0 }}>
                        <Col>
                          <Button
                            key='details'
                            size={screens.xs ? 'small' : 'middle'}
                            onClick={() => showDoctorDetails(doctor)}
                          >
                            View Details
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            danger
                            key='revoke'
                            size={screens.xs ? 'small' : 'middle'}
                            onClick={() => handleRevokeAccess(doctor)}
                          >
                            Revoke Access
                          </Button>
                        </Col>
                      </Row>  
                    </List.Item>
                  )}
                />
              </Card>
            )}
            <Card bordered>
              <Title level={4} style={{ marginBottom: 20 }}>
                Search Doctors and Grant Access
              </Title>
              <Search
                placeholder='Search doctors by name, specialization, or hospital'
                enterButton='Search'
                size={screens.xs ? 'middle' : 'large'}
                onSearch={handleSearch}
                style={{ marginBottom: 10 }}
              />
              <List
                itemLayout={screens.xs ? 'vertical' : 'horizontal'}
                dataSource={state.filteredDoctors}
                renderItem={(doctor) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={doctor.photoUrl} size={60} />}
                      title={
                        <span style={{ fontSize: screens.xs ? '14px' : '15px', fontWeight: 'bold' }}>
                          {doctor.name}
                        </span>
                      }
                      description={
                        <span style={{ fontSize: screens.xs ? '12px' : '13px' }}>
                          {doctor.specialization} at {doctor.currentWorkingHospital}
                        </span>
                      }
                    />
                    <Row justify='center' gutter={16} style={{ marginTop: screens.xs ? 15 : 0 }}>
                      <Col>
                        <Button
                          key='details'
                          size={screens.xs ? 'small' : 'middle'}
                          onClick={() => showDoctorDetails(doctor)}
                        >
                          View Details
                        </Button>
                      </Col>
                      <Col>
                        {isDoctorGrantedAccess(doctor.address) ? (
                          <Button
                            key='granted'
                            type='default'
                            disabled
                            size={screens.xs ? 'small' : 'middle'}
                          >
                            Access Granted
                          </Button>
                        ) : (
                          <Button
                            key='grant'
                            type='primary'
                            size={screens.xs ? 'small' : 'middle'}
                            onClick={() => handleGrantAccess(doctor)}
                          >
                            Grant Access
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </Col>
      <Modal
        title={`${state.selectedDoctor?.name}'s Details`}
        open={state.isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button key='close' onClick={handleCancelModal}>
            Close
          </Button>,
        ]}
        width={screens.xxl || screens.xl ? '60%' : '90%'}
      >
        {state.selectedDoctor && (
          <ProfileCard
            title={state.selectedDoctor.name}
            items={[
              { label: 'Name', children: state.selectedDoctor.name },
              { label: 'Age', children: state.selectedDoctor.age },
              { label: 'Gender', children: state.selectedDoctor.gender},
              { label: 'Email', children: state.selectedDoctor.email },
              { label: 'Contact Number', children: state.selectedDoctor.contactNumber },
              { label: 'Current Working Hospital', children: state.selectedDoctor.currentWorkingHospital },
              { label: 'Specialization', children: state.selectedDoctor.specialization },
            ]}
            avatarUrl={state.selectedDoctor.photoUrl}
          />
        )}
      </Modal>
    </ContentLayout>
  );  
};

export default Doctors;
