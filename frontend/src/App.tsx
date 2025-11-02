
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MyOrdersPage from './pages/orders/MyOrdersPage';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminProducts from './pages/admin/ProductsPage';
import AdminTables from './pages/admin/TablesPage';
import AdminOrders from './pages/admin/OrdersPage';
import AdminStatistics from './pages/admin/StatisticsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#7c3aed',
                    borderRadius: 8
                }
            }}
        >
            <AntdApp>
                <Routes>
                    <Route element={<MainLayout />}> 
                        <Route index element={<HomePage />} />
                        <Route path="menu" element={<MenuPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                        <Route path="orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="tables" element={<AdminTables />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="statistics" element={<AdminStatistics />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AntdApp>
        </ConfigProvider>
    );
}


