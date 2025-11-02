import { Button, InputNumber, List, Typography, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

export default function CartPage() {
    const { items, totalPrice, update, remove } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    if (!items.length) {
        return (
            <Result
                status="info"
                title="Giỏ hàng trống"
                extra={<Link to="/menu">Xem thực đơn</Link>}
            />
        );
    }

    return (
        <div>
            <Typography.Title level={2}>Giỏ hàng</Typography.Title>
            <List
                dataSource={items}
                renderItem={(it) => (
                    <List.Item
                        actions={[
                            <InputNumber min={1} value={it.quantity} onChange={(v) => update(it.productId, Number(v))} />, 
                            <Button danger onClick={() => remove(it.productId)}>Xóa</Button>
                        ]}
                    >
                        <List.Item.Meta title={it.name} description={`${it.price.toLocaleString()} đ`} />
                        <div>{(it.price * it.quantity).toLocaleString()} đ</div>
                    </List.Item>
                )}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                <Typography.Title level={4}>Tổng: {totalPrice.toLocaleString()} đ</Typography.Title>
                <Button type="primary" onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')}>Thanh toán</Button>
            </div>
        </div>
    );
}


