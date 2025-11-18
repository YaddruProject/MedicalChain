import { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Card, Typography, Flex, message } from 'antd';
import { CameraOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const FacialRecognition = ({ visible, onUpload, onCancel, title = "Facial Recognition Setup", buttonText = "Upload" }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (error) {
            console.error('Error accessing camera:', error);
            message.error('Failed to access camera. Please grant camera permissions.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleUpload = async () => {
        if (!capturedImage) {
            message.warning('Please capture a photo first');
            return;
        }

        setIsUploading(true);
        try {
            // Convert base64 to blob
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'facial-image.jpg', { type: 'image/jpeg' });
            
            await onUpload(file);
            setCapturedImage(null);
            stopCamera();
        } catch (error) {
            console.error('Error uploading facial image:', error);
            message.error('Failed to upload facial image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setCapturedImage(null);
        stopCamera();
        onCancel();
    };

    const handleAfterOpen = () => {
        if (!capturedImage) {
            startCamera();
        }
    };

    const handleAfterClose = () => {
        stopCamera();
        setCapturedImage(null);
    };

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            afterOpenChange={(open) => {
                if (open) handleAfterOpen();
                else handleAfterClose();
            }}
            destroyOnClose
        >
            <Card bordered={false}>
                <Flex vertical align="center" gap="middle">
                    <Title level={5} style={{ marginBottom: 0 }}>
                        {capturedImage ? 'Review Your Photo' : 'Position your face in the camera'}
                    </Title>
                    
                    <div style={{ 
                        width: '100%', 
                        maxWidth: '640px', 
                        display: 'flex', 
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        {capturedImage ? (
                            <img 
                                src={capturedImage} 
                                alt="Captured" 
                                style={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    maxHeight: '480px',
                                    objectFit: 'contain'
                                }} 
                            />
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                style={{ 
                                    width: '100%', 
                                    height: 'auto',
                                    maxHeight: '480px'
                                }}
                            />
                        )}
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {!capturedImage && (
                        <Text type="secondary" style={{ textAlign: 'center' }}>
                            Make sure your face is clearly visible and well-lit
                        </Text>
                    )}

                    <Flex gap="small" wrap="wrap" justify="center">
                        {!capturedImage ? (
                            <Button
                                type="primary"
                                size="large"
                                icon={<CameraOutlined />}
                                onClick={capturePhoto}
                                disabled={!stream}
                            >
                                Capture Photo
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="large"
                                    icon={<ReloadOutlined />}
                                    onClick={retakePhoto}
                                >
                                    Retake
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<UploadOutlined />}
                                    onClick={handleUpload}
                                    loading={isUploading}
                                >
                                    {buttonText}
                                </Button>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Card>
        </Modal>
    );
};

FacialRecognition.propTypes = {
    visible: PropTypes.bool.isRequired,
    onUpload: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string,
    buttonText: PropTypes.string,
};

export default FacialRecognition;
