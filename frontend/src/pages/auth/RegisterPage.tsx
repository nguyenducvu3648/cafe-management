import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/auth';

export default function RegisterPage() {
    const register = useAuthStore((s) => s.register);
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string; fullName?: string }) => {
        try {
            await register(values);
            message.success('Đăng ký thành công');
            navigate('/');
        } catch (e: any) {
            message.error(e?.response?.data || 'Đăng ký thất bại');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <Card title="Đăng ký" style={{ width: 360 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Họ tên" name="fullName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, min: 4 }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đăng ký</Button>
                    </Form.Item>
                </Form>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}


