import { Layout, Menu, Typography, Badge, Button } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, HomeOutlined, CoffeeOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/auth';
import useCartStore from '../../store/cart';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { totalQuantity } = useCartStore();

    const selectedKeys = [location.pathname === '/' ? '/' : `/${location.pathname.split('/')[1]}`];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ color: 'white', fontWeight: 700, marginRight: 24 }}>Cafe</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={selectedKeys}
                    items={[
                        { key: '/', label: <Link to="/">Trang chủ</Link>, icon: <HomeOutlined /> },
                        { key: '/menu', label: <Link to="/menu">Thực đơn</Link>, icon: <CoffeeOutlined /> },
                        { key: '/cart', label: (
                            <Badge count={totalQuantity} size="small">
                                <span style={{ marginLeft: 8 }}>Giỏ hàng</span>
                            </Badge>
                        ), icon: <ShoppingCartOutlined /> }
                    ]}
                    style={{ flex: 1 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    {!isAuthenticated ? (
                        <>
                            <Button icon={<LoginOutlined />} onClick={() => navigate('/login')}>Đăng nhập</Button>
                            <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
                        </>
                    ) : (
                        <>
                            {user?.role === 'ADMIN' && (
                                <Button onClick={() => navigate('/admin')}>Quản trị</Button>
                            )}
                            <Button icon={<UserOutlined />} onClick={() => navigate('/orders')}>{user?.fullName || user?.username}</Button>
                            <Button danger icon={<LogoutOutlined />} onClick={logout}>Thoát</Button>
                        </>
                    )}
                </div>
            </Header>
            <Content style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <Outlet />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <Typography.Text type="secondary">© {new Date().getFullYear()} Cafe Management</Typography.Text>
            </Footer>
        </Layout>
    );
}


