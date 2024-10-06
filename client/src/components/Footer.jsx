import { Layout, Row, Col, Divider } from 'antd';

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <AntdFooter className='footer'>
      <Divider style={{ marginTop: 0 }} />
      <Row justify='center'>
        <Col>
          <p>© 2024 Medical Chain. All rights reserved.</p>
        </Col>
      </Row>
    </AntdFooter>
  )
}

export default Footer;
