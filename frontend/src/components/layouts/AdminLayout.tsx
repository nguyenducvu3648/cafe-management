import { Layout, Menu } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, ShoppingOutlined, TableOutlined, BarChartOutlined, OrderedListOutlined } from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
    const location = useLocation();
    const base = '/admin';
    const current = location.pathname.replace(base, '') || '/';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider breakpoint="lg">
                <div style={{ color: 'white', fontWeight: 700, padding: 16 }}>Admin</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[current === '/' ? '/' : `/${current.split('/')[1]}`]}
                    items={[
                        { key: '/', icon: <DashboardOutlined />, label: <Link to="/admin">Tổng quan</Link> },
                        { key: '/products', icon: <ShoppingOutlined />, label: <Link to="/admin/products">Món</Link> },
                        { key: '/tables', icon: <TableOutlined />, label: <Link to="/admin/tables">Bàn</Link> },
                        { key: '/orders', icon: <OrderedListOutlined />, label: <Link to="/admin/orders">Đơn hàng</Link> },
                        { key: '/statistics', icon: <BarChartOutlined />, label: <Link to="/admin/statistics">Thống kê</Link> }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ background: 'white', padding: '0 16px', fontWeight: 600 }}>Bảng điều khiển</Header>
                <Content style={{ margin: 16, padding: 16, background: 'white' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}


