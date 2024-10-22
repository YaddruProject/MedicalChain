import PropTypes from 'prop-types';
import { Layout, Row } from 'antd';

const { Content } = Layout;

const ContentLayout = ({ children }) => {
  return (
    <Layout>
      <Content
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <Row
          justify='center'
          align='middle'
          style={{ width: '100%', height: '100%'}}
        >
        {children}
        </Row>
      </Content>
    </Layout>
  );
};

ContentLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContentLayout;
