import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Button, Tag, Segmented, Input } from 'antd';
import http from '../api/http';
import useCartStore from '../store/cart';

type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    available?: boolean;
};

const categories = ['ALL', 'COFFEE', 'TEA', 'SMOOTHIE', 'JUICE', 'SNACK', 'DESSERT'] as const;

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<(typeof categories)[number]>('ALL');
    const [search, setSearch] = useState('');
    const addToCart = useCartStore((s) => s.add);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await http.get('/products/available');
                setProducts(res.data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = products
        .filter((p) => (category === 'ALL' ? true : p.category === category))
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <Typography.Title level={2}>Thực đơn</Typography.Title>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <Segmented options={categories as unknown as string[]} value={category} onChange={(v) => setCategory(v as any)} />
                <Input.Search placeholder="Tìm món" onSearch={setSearch} allowClear style={{ maxWidth: 320 }} />
            </div>
            <Row gutter={[16, 16]}>
                {filtered.map((p) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                        <Card
                            loading={loading}
                            cover={p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : undefined}
                            actions={[<Button type="link" onClick={() => addToCart({ productId: p.id, name: p.name, price: p.price })}>Thêm</Button>]}
                        >
                            <Card.Meta title={p.name} description={p.description} />
                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography.Text strong>{p.price.toLocaleString()} đ</Typography.Text>
                                {p.category && <Tag>{p.category}</Tag>}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}


