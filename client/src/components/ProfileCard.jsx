import PropTypes from 'prop-types';
import { Card, Avatar, Button, Grid, Descriptions } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid;

const ProfileCard = ({ title, items, avatarUrl, onEdit = null }) => {
    const screens = useBreakpoint();

    return (
        <Card
            style={{ textAlign: 'center' }}
            bordered={true}
        >
            <Avatar
                size={screens.xs ? 100 : 150}
                src={avatarUrl ? avatarUrl : "https://example.com/default-avatar.png"}
                style={{ marginBottom: 20 }}
            />
            <Descriptions
                title={title}
                items={items}
                bordered
                column={1}
                style={{ margin: '0 auto', textAlign: 'center', maxWidth: '800px' }}
            />
            {onEdit && (
                <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={onEdit}
                    style={{ marginTop: 20 }}
                >
                    Edit
                </Button>
            )}
        </Card>
    )
}

ProfileCard.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
}

export default ProfileCard;
