import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, gql } from '@apollo/client';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Typography,
  Spin,
  Empty,
  Badge,
  Space,
  Input,
  Select,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;
const { Option } = Select;

const GET_READY_PCS = gql`
    query readyPcs {
        readyPcs {
            id
            name
            price
            description
            category
        }
    }
`;

interface ReadyPc {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  inStock?: boolean;
}

export const Route = createFileRoute('/list-pc')({
  component: ReadyPcsRouteComponent,
});

function ReadyPcsRouteComponent() {
  const { data, loading, error } = useQuery<{ readyPcs: ReadyPc[] }>(GET_READY_PCS);
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'default'>('default');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin size="large" description="Загрузка готовых ПК..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Text type="danger">Ошибка загрузки каталога: {error.message}</Text>
      </div>
    );
  }

  const pcs = data?.readyPcs || [];
  const filteredPcs = pcs
    .filter((pc) => pc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (pc: ReadyPc) => {
    addToCart({
      id: pc.id,
      name: pc.name,
      price: pc.price,
    });
    message.success(`ПК "${pc.name}" добавлен в корзину!`);
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2} style={{ color: '#fff' }}>
          <ThunderboltOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          Игровые и рабочие готовые ПК
        </Title>
        <Text style={{ color: '#8c8c8c' }}>
          Выберите протестированную сборку с официальной гарантией и оперативной доставкой
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} justify="space-between" align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Поиск по названию..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            defaultValue="default"
            style={{ width: '100%' }}
            onChange={(value) => setSortBy(value as any)}
          >
            <Option value="default">Сортировка: По умолчанию</Option>
            <Option value="price_asc">Сначала дешевле</Option>
            <Option value="price_desc">Сначала дороже</Option>
          </Select>
        </Col>
      </Row>

      {filteredPcs.length === 0 ? (
        <Empty description={<span style={{ color: '#8c8c8c' }}>Компьютеры не найдены</span>} />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredPcs.map((pc) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pc.id}>
              <Badge.Ribbon
                text={pc.inStock ?? true ? 'В наличии' : 'Под заказ'}
                color={pc.inStock ?? true ? 'green' : 'volcano'}
              >
                <Card
                  hoverable
                  style={{ backgroundColor: '#141414', borderColor: '#262626' }}
                  cover={
                    <img
                      alt={pc.name}
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80"
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      type="primary"
                      danger
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(pc)}
                    >
                      В корзину
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={<Text strong style={{ fontSize: 16, color: '#fff' }}>{pc.name}</Text>}
                    description={
                      <Space orientation="vertical" size={4} style={{ width: '100%', marginTop: 8 }}>
                        {pc.category && <Tag color="blue">{pc.category}</Tag>}
                        {pc.description && <Text style={{ color: '#8c8c8c', fontSize: 12 }}>{pc.description}</Text>}

                        <div style={{ marginTop: 12, textAlign: 'right' }}>
                          <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                            {formatPrice(pc.price)}
                          </Title>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}