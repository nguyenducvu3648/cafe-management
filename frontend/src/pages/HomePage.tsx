import { Button, Card, Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <Flex vertical align="center" gap={24} style={{ paddingTop: 24 }}>
            <Typography.Title>Chào mừng đến với Cafe</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ maxWidth: 640, textAlign: 'center' }}>
                Thưởng thức đồ uống chất lượng và đặt món nhanh chóng. Xem thực đơn và đặt hàng ngay!
            </Typography.Paragraph>
            <Flex gap={12}>
                <Link to="/menu"><Button type="primary" size="large">Xem thực đơn</Button></Link>
                <Link to="/cart"><Button size="large">Giỏ hàng</Button></Link>
            </Flex>
            <Card style={{ maxWidth: 960, width: '100%' }}>
                <Typography.Title level={4}>Khuyến mãi hôm nay</Typography.Title>
                <Typography.Text>Giảm 10% cho đơn hàng đầu tiên sau khi đăng ký!</Typography.Text>
            </Card>
        </Flex>
    );
}


