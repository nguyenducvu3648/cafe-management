import { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Select, Space, Table, Tag, message } from 'antd';
import http from '../../api/http';

type CafeTable = { id?: number; name: string; status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' };

export default function TablesPage() {
    const [data, setData] = useState<CafeTable[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CafeTable | null>(null);
    const [form] = Form.useForm<CafeTable>();

    const load = async () => {
        const res = await http.get('/tables');
        setData(res.data);
    };

    useEffect(() => { load(); }, []);

    const onSave = async () => {
        const values = await form.validateFields();
        if (editing?.id) {
            await http.put(`/admin/tables/${editing.id}`, values);
            message.success('Cập nhật thành công');
        } else {
            await http.post('/admin/tables', values);
            message.success('Tạo bàn thành công');
        }
        setOpen(false); setEditing(null); load();
    };

    const onDelete = async (id: number) => {
        await http.delete(`/admin/tables/${id}`);
        message.success('Đã xoá');
        load();
    };

    const onStatus = async (id: number, status: CafeTable['status']) => {
        await http.patch(`/admin/tables/${id}/status`, { status });
        load();
    };

    return (
        <div>
            <Space style={{ marginBottom: 12 }}>
                <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>Thêm bàn</Button>
            </Space>
            <Table rowKey="id" dataSource={data}
                columns={[
                    { title: 'Tên', dataIndex: 'name' },
                    { title: 'Trạng thái', dataIndex: 'status', render: (s: CafeTable['status']) => <Tag color={s === 'AVAILABLE' ? 'green' : s === 'OCCUPIED' ? 'volcano' : 'gold'}>{s}</Tag> },
                    { title: 'Hành động', render: (_: any, r: CafeTable) => (
                        <Space>
                            <Button onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>Sửa</Button>
                            <Select value={r.status} style={{ width: 140 }} onChange={(v) => onStatus(r.id!, v)}
                                options={[{ value: 'AVAILABLE' }, { value: 'OCCUPIED' }, { value: 'RESERVED' }]} />
                            <Button danger onClick={() => onDelete(r.id!)}>Xoá</Button>
                        </Space>
                    )}
                ]}
            />

            <Drawer title={editing ? 'Sửa bàn' : 'Thêm bàn'} open={open} onClose={() => setOpen(false)} width={420}
                extra={<Space><Button onClick={() => setOpen(false)}>Huỷ</Button><Button type="primary" onClick={onSave}>Lưu</Button></Space>}>
                <Form layout="vertical" form={form}>
                    <Form.Item label="Tên bàn" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}


