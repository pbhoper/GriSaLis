import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Typography, Button, Card } from 'antd';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

export const Route = createFileRoute('/checkout')({
  component: CheckoutComponent,
});

function CheckoutComponent() {
  const { cart, totalPrice } = useCart();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

  return (
    <div style={{ padding: '40px 16px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <Title level={2} style={{ color: '#fff' }}>Оформление заказа</Title>

      <Card style={{ backgroundColor: '#141414', borderColor: '#262626', marginBottom: 24 }}>
        <Title level={4} style={{ color: '#fff' }}>Ваши товары:</Title>
        {cart.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#fff' }}>{item.name} (x{item.quantity})</Text>
            <Text style={{ color: '#ff4d4f' }}>{formatPrice(item.price * item.quantity)}</Text>
          </div>
        ))}
        <hr style={{ borderColor: '#262626', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Итого:</Title>
          <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>{formatPrice(totalPrice)}</Title>
        </div>
      </Card>

      <Button type="primary" danger size="large" block>
        Подтвердить заказ
      </Button>
    </div>
  );
}