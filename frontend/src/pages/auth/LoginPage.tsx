import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/auth';

export default function LoginPage() {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();
    const location = useLocation() as any;

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            await login(values.username, values.password);
            const to = location.state?.from?.pathname || '/';
            message.success('Đăng nhập thành công');
            navigate(to, { replace: true });
        } catch (e: any) {
            message.error(e?.response?.data || 'Đăng nhập thất bại');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <Card title="Đăng nhập" style={{ width: 360 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
                    </Form.Item>
                </Form>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}


