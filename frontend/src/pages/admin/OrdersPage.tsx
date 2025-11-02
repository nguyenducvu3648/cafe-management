import { useEffect, useState } from 'react';
import { Button, Select, Space, Table, Tag, Typography } from 'antd';
import http from '../../api/http';

type OrderItem = { productName: string; quantity: number; price: number };
type Order = { id: number; status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'; totalAmount: number; items: OrderItem[] };

const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await http.get('/admin/orders');
            setOrders(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: number, status: Order['status']) => {
        await http.patch(`/admin/orders/${id}/status`, { status });
        load();
    };

    return (
        <div>
            <Typography.Title level={3}>Quản lý đơn hàng</Typography.Title>
            <Table rowKey="id" loading={loading} dataSource={orders}
                expandable={{ expandedRowRender: (r) => (
                    <Table pagination={false} dataSource={r.items} rowKey={(i) => `${i.productName}-${i.price}`}
                        columns={[{ title: 'Món', dataIndex: 'productName' }, { title: 'SL', dataIndex: 'quantity' }, { title: 'Giá', dataIndex: 'price' }]} />
                )}}
                columns={[
                    { title: 'Mã', dataIndex: 'id', width: 100 },
                    { title: 'Trạng thái', dataIndex: 'status', render: (s: Order['status']) => <Tag>{s}</Tag> },
                    { title: 'Tổng', dataIndex: 'totalAmount', render: (v: number) => `${v.toLocaleString()} đ` },
                    { title: 'Hành động', render: (_: any, r: Order) => (
                        <Space>
                            <Select value={r.status} style={{ width: 160 }} onChange={(v) => updateStatus(r.id, v)} options={statuses.map(s => ({ value: s }))} />
                            <Button onClick={load}>Làm mới</Button>
                        </Space>
                    )}
                ]}
            />
        </div>
    );
}


