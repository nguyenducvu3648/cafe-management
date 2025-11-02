import { useEffect, useState } from 'react';
import { Table, Tag, Typography } from 'antd';
import http from '../../api/http';

type OrderItem = { productName: string; price: number; quantity: number };
type Order = { id: number; status: string; totalAmount: number; items: OrderItem[]; createdAt?: string };

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await http.get('/orders/my-orders');
                setOrders(res.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <Typography.Title level={2}>Đơn hàng của tôi</Typography.Title>
            <Table
                rowKey="id"
                loading={loading}
                dataSource={orders}
                columns={[
                    { title: 'Mã', dataIndex: 'id', width: 100 },
                    { title: 'Trạng thái', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> },
                    { title: 'Số món', render: (_: any, r: Order) => r.items?.length || 0 },
                    { title: 'Tổng', dataIndex: 'totalAmount', render: (v) => `${v?.toLocaleString?.() || 0} đ` }
                ]}
            />
        </div>
    );
}


