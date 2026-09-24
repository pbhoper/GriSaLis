import React, { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@apollo/client';
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  Typography,
  Spin,
  Space,
  Divider,
  Statistic,
  message,
  Tag,
  Empty,
} from 'antd';
import {
  BuildOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { GET_COMPONENTS, CREATE_ASSEMBLY_MUTATION } from '@/graphql/builder';

const { Title, Text } = Typography;

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

const CATEGORIES = [
  { key: 'CPU', label: 'Процессор' },
  { key: 'MOTHERBOARD', label: 'Материнская плата' },
  { key: 'RAM', label: 'Оперативная память' },
  { key: 'GPU', label: 'Видеокарта' },
  { key: 'STORAGE', label: 'Накопитель (SSD/HDD)' },
  { key: 'PSU', label: 'Блок питания' },
  { key: 'CASE', label: 'Корпус' },
  { key: 'COOLING', label: 'Охлаждение' },
];

export const Route = createFileRoute('/assembly-pc')({
  component: AssemblyPcRouteComponent,
});

function AssemblyPcRouteComponent() {

  const { data, loading, error } = useQuery<{ components: ComponentItem[] }>(GET_COMPONENTS);
  const [createAssembly, { loading: saving }] = useMutation(CREATE_ASSEMBLY_MUTATION);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, ComponentItem | null>>({});
  const components = data?.components || [];

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((sum, item) => {
      return sum + (item ? item.price : 0);
    }, 0);
  }, [selectedComponents]);

  const handleSelectComponent = (categoryKey: string, componentId: string) => {
    const item = components.find((c) => c.id === componentId) || null;
    setSelectedComponents((prev) => ({
      ...prev,
      [categoryKey]: item,
    }));
  };

  const handleClearCategory = (categoryKey: string) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [categoryKey]: null,
    }));
  };

  const handleSaveAssembly = async () => {
    const componentIds = Object.values(selectedComponents)
      .filter((item): item is ComponentItem => item !== null)
      .map((item) => item.id);

    if (componentIds.length === 0) {
      message.warning('Выберите хотя бы одну комплектующую!');
      return;
    }

    try {
      await createAssembly({
        variables: {
          input: {
            componentIds,
            totalPrice,
          },
        },
      });
      message.success('Конфигурация ПК успешно сохранена!');
    } catch (err: any) {
      message.error(err.message || 'Ошибка при сохранении сборки');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin size="large" description="Загрузка комплектующих..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Text type="danger">Ошибка загрузки компонентов: {error.message}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2}>
          <BuildOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Конструктор сборки ПК
        </Title>
        <Text type="secondary">
          Соберите кастомную конфигурацию. Совместимость компонентов проверяется автоматически.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {CATEGORIES.map((cat) => {
              const categoryComponents = components.filter(
                (c) => c.category?.toUpperCase() === cat.key
              );
              const currentSelected = selectedComponents[cat.key];

              return (
                <Card key={cat.key} size="small" style={{ borderRadius: 8 }}>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col xs={24} sm={6}>
                      <Text strong style={{ fontSize: 15 }}>
                        {cat.label}
                      </Text>
                    </Col>
                    <Col xs={20} sm={15}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder={`Выберите ${cat.label.toLowerCase()}...`}
                        value={currentSelected?.id || undefined}
                        onChange={(val) => handleSelectComponent(cat.key, val)}
                        allowClear
                        onClear={() => handleClearCategory(cat.key)}
                      >
                        {categoryComponents.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.name}</span>
                              <Tag color="blue">{formatPrice(item.price)}</Tag>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={4} sm={3} style={{ textAlign: 'right' }}>
                      {currentSelected && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleClearCategory(cat.key)}
                        />
                      )}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Ваша конфигурация"
            style={{ position: 'sticky', top: 24, borderRadius: 8 }}
            actions={[
              <Button
                type="primary"
                danger
                block
                size="large"
                icon={<ShoppingCartOutlined />}
                loading={saving}
                onClick={handleSaveAssembly}
                style={{ margin: '0 16px', width: 'calc(100% - 32px)', fontWeight: 600 }}
              >
                Сохранить сборку
              </Button>,
            ]}
          >
            <Statistic
              title="Итоговая стоимость"
              value={totalPrice}
              formatter={(value) => formatPrice(Number(value))}
              valueStyle={{ color: '#ff4d4f', fontWeight: 700 }}
            />

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {Object.keys(selectedComponents).length === 0 ||
              Object.values(selectedComponents).every((v) => v === null) ? (
                <Empty description="Компоненты не выбраны" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  {CATEGORIES.map((cat) => {
                    const item = selectedComponents[cat.key];
                    if (!item) return null;
                    return (
                      <div
                        key={cat.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 13,
                          borderBottom: '1px dashed #f0f0f0',
                          paddingBottom: 6,
                        }}
                      >
                        <div>
                          <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                            {cat.label}
                          </Text>
                          <Text strong>{item.name}</Text>
                        </div>
                        <Text style={{ whiteSpace: 'nowrap', marginLeft: 8 }}>
                          {formatPrice(item.price)}
                        </Text>
                      </div>
                    );
                  })}
                </Space>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}