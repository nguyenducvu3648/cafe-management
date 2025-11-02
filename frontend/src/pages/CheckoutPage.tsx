import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Typography, message } from 'antd';
import useCartStore from '../store/cart';
import http from '../api/http';
import { useNavigate } from 'react-router-dom';

type CafeTable = { id: number; name: string; status: string };

export default function CheckoutPage() {
    const { items, clear, totalPrice } = useCartStore();
    const [tables, setTables] = useState<CafeTable[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const res = await http.get('/tables/available');
            setTables(res.data);
        };
        load();
    }, []);

    const onFinish = async (values: { tableId?: number; note?: string }) => {
        setLoading(true);
        try {
            const payload = {
                tableId: values.tableId || null,
                note: values.note || '',
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, note: '' }))
            };
            await http.post('/orders', payload);
            message.success('Đặt hàng thành công');
            clear();
            navigate('/orders');
        } catch (e: any) {
            message.error(e?.response?.data || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography.Title level={2}>Thanh toán</Typography.Title>
            <Typography.Paragraph>Tổng thanh toán: {totalPrice.toLocaleString()} đ</Typography.Paragraph>
            <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 480 }}>
                <Form.Item label="Chọn bàn (tuỳ chọn)" name="tableId">
                    <Select allowClear placeholder="Chọn bàn">
                        {tables.map((t) => (
                            <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Xác nhận đặt hàng</Button>
                </Form.Item>
            </Form>
        </div>
    );
}


