import { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch, Table, Tag, message } from 'antd';
import http from '../../api/http';

type Product = { id?: number; name: string; description?: string; price: number; imageUrl?: string; category?: string; available?: boolean };

const categories = ['COFFEE', 'TEA', 'SMOOTHIE', 'JUICE', 'SNACK', 'DESSERT'];

export default function ProductsPage() {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form] = Form.useForm<Product>();

    const load = async () => {
        setLoading(true);
        try {
            const res = await http.get('/products');
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onSave = async () => {
        const values = await form.validateFields();
        try {
            if (editing?.id) {
                await http.put(`/admin/products/${editing.id}`, values);
                message.success('Cập nhật thành công');
            } else {
                await http.post('/admin/products', values);
                message.success('Tạo món thành công');
            }
            setOpen(false);
            setEditing(null);
            load();
        } catch (e: any) {
            message.error(e?.response?.data || 'Lỗi xử lý');
        }
    };

    const onDelete = async (id: number) => {
        await http.delete(`/admin/products/${id}`);
        message.success('Đã xoá');
        load();
    };

    const onToggle = async (id: number) => {
        await http.patch(`/admin/products/${id}/toggle`);
        load();
    };

    return (
        <div>
            <Space style={{ marginBottom: 12 }}>
                <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>Thêm món</Button>
            </Space>
            <Table rowKey="id" loading={loading} dataSource={data} 
                columns={[
                    { title: 'Tên', dataIndex: 'name' },
                    { title: 'Giá', dataIndex: 'price', render: (v: number) => `${v.toLocaleString()} đ` },
                    { title: 'Danh mục', dataIndex: 'category', render: (c: string) => c && <Tag>{c}</Tag> },
                    { title: 'Hiển thị', dataIndex: 'available', render: (v: boolean, r: Product) => <Switch checked={!!v} onChange={() => onToggle(r.id!)} /> },
                    { title: 'Hành động', render: (_: any, r: Product) => (
                        <Space>
                            <Button onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>Sửa</Button>
                            <Button danger onClick={() => onDelete(r.id!)}>Xoá</Button>
                        </Space>
                    )}
                ]}
            />

            <Drawer title={editing ? 'Sửa món' : 'Thêm món'} open={open} onClose={() => setOpen(false)} width={420}
                extra={<Space><Button onClick={() => setOpen(false)}>Huỷ</Button><Button type="primary" onClick={onSave}>Lưu</Button></Space>}>
                <Form layout="vertical" form={form} initialValues={{ available: true }}>
                    <Form.Item label="Tên" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Mô tả" name="description"><Input.TextArea rows={3} /></Form.Item>
                    <Form.Item label="Giá" name="price" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item label="Ảnh" name="imageUrl"><Input /></Form.Item>
                    <Form.Item label="Danh mục" name="category"><Select allowClear options={categories.map(c => ({ value: c, label: c }))} /></Form.Item>
                    <Form.Item label="Hiển thị" name="available" valuePropName="checked"><Switch /></Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}


