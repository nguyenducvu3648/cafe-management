import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import http from '../../api/http';

type Statistics = { totalOrders: number; totalRevenue: number; pendingOrders: number };

export default function StatisticsPage() {
    const [stats, setStats] = useState<Statistics | null>(null);
    useEffect(() => {
        const load = async () => {
            const res = await http.get('/admin/statistics');
            setStats(res.data);
        };
        load();
    }, []);

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}><Card><Statistic title="Tổng đơn hôm nay" value={stats?.totalOrders || 0} /></Card></Col>
            <Col xs={24} md={8}><Card><Statistic title="Doanh thu hôm nay" value={stats?.totalRevenue || 0} suffix="đ" /></Card></Col>
            <Col xs={24} md={8}><Card><Statistic title="Đơn chờ" value={stats?.pendingOrders || 0} /></Card></Col>
        </Row>
    );
}


