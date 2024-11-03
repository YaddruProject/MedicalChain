import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, Col, Card, List, Typography, Avatar, Grid, Spin, Modal, message, Row } from 'antd';

import ContentLayout from '@components/ContentLayout';
import ProfileCard from '@components/ProfileCard';
import RecordList from '@components/RecordList';
import useContract from '@hooks/useContract';
import useCustomState from '@hooks/useCustomState';
import { pinata } from '@services/pinata';

const PatientInfo = () => {
    const { patientAddress } = useParams();
    const contract = useContract();
    const [state, updateState] = useCustomState({
        patientInfo: null,
        patientItems: [],
        isLoading: true,
    });

    const fetchPatientInfo = useCallback(async () => {
        updateState({ isLoading: true });
        try {
            const data = await contract.getPatientInfo(patientAddress);
            const patientData = {
                address: data[0],
                name: data[1],
                age: Number(data[2]),
                gender: data[3],
                email: data[4],
                contactNumber: data[5],
                healthIssues: data[6],
                bloodGroup: data[7],
                aadhaarNumber: data[8],
                avatarUrl: pinata.getIPFSUrl(data[9]),
            };
            updateState({
                patientInfo: patientData,
                patientItems: [
                    { key: 1, label: 'Address', children: patientData.address },
                    { key: 2, label: 'Name', children: patientData.name },
                    { key: 3, label: 'Age', children: patientData.age },
                    { key: 4, label: 'Gender', children: patientData.gender },
                    { key: 5, label: 'Email', children: patientData.email },
                    { key: 6, label: 'Contact Number', children: patientData.contactNumber },
                    { key: 7, label: 'Health Issues', children: patientData.healthIssues },
                    { key: 8, label: 'Blood Group', children: patientData.bloodGroup },
                    { key: 9, label: 'Aadhaar Number', children: patientData.aadhaarNumber },
                ],
                isLoading: false,
            });
        } catch (error) {
            console.error(error);
            message.error('Error fetching patient info');
            updateState({ isLoading: false });
        }
    }, [contract, patientAddress]);

    useEffect(() => {
        fetchPatientInfo();
    }, [contract, fetchPatientInfo]);

    return (
        <ContentLayout>
            {state.isLoading ? (
                <Spin />
            ) : (
                <>
                    <Col span={24}>
                        <ProfileCard
                            title="Patient Info"
                            avatarUrl={state.patientInfo.avatarUrl}
                            items={state.patientItems}
                        />
                    </Col>
                    <Col span={24} style={{ marginTop: 15 }}>
                        <RecordList patientAddress={patientAddress} />
                    </Col>
                </>
            )}
        </ContentLayout>
    );
}

export default PatientInfo