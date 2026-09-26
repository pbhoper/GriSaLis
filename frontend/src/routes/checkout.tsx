import React, {
  useState
} from 'react';
import {
  createFileRoute,
  useNavigate } from '@tanstack/react-router';
import {
  Typography,
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Result,
  Empty,
  message,
  Divider
} from 'antd';
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons';
import {
  useMutation,
  gql
} from '@apollo/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const {
  Title,
  Text
} = Typography;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      createdAt
    }
  }
`;

export const Route = createFileRoute('/checkout')({
  component: CheckoutComponent,
});

function CheckoutComponent() {
  const { cart, totalPrice, removeFromCart } = useCart();
  const { userId, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [createdOrder, setCreatedOrder] = useState<{ id: number; createdAt: string } | null>(null);

  const [createOrder, { loading }] = useMutation(CREATE_ORDER_MUTATION, {
    onCompleted: (data) => {
      setCreatedOrder(data.createOrder);
      cart.forEach((item) => removeFromCart(item.id));
      message.success('Заказ успешно оформлен!');
    },
    onError: (err) => {
      message.error(`Ошибка при оформлении заказа: ${err.message}`);
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

  const handleFinish = (values: { clientName: string; address: string }) => {
    if (cart.length === 0) {
      message.warning('Ваша корзина пуста!');
      return;
    }

    const pcNames = cart.map((item) => `${item.name} (x${item.quantity})`).join(', ');
    const componentsJson = JSON.stringify(cart);

    createOrder({
      variables: {
        input: {
          userId: userId ? Number(userId) : undefined,
          clientName: values.clientName,
          address: values.address,
          pcName: pcNames,
          components: componentsJson,
          price: totalPrice,
        },
      },
    });
  };

  if (createdOrder) {
    return (
      <div style={{ padding: '60px 16px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Result
          status="success"
          title={`Заказ №${createdOrder.id} успешно создан!`}
          subTitle="Спасибо за покупку. Наш менеджер свяжется с вами в ближайшее время для подтверждения доставки."
          extra={[
            <Button
              type="primary"
              danger
              key="home"
              onClick={() => navigate({ to: '/' as any })}
            >
              На главную
            </Button>,
            <Button
              key="catalog"
              onClick={() => navigate({ to: '/list-pc' as any })}
            >
              В каталог ПК
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: '80px 16px', textAlign: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text style={{ color: '#8c8c8c' }}>В вашей корзине пока нет товаров</Text>}
        >
          <Button
            type="primary"
            danger
            icon={<ShoppingOutlined />}
            onClick={() => navigate({ to: '/list-pc' as any })}
          >
            Перейти в каталог ПК
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 16px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
        Оформление заказа
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Card style={{ backgroundColor: '#141414', borderColor: '#262626' }}>
            <Title level={4} style={{ color: '#fff', marginTop: 0, marginBottom: 20 }}>
              Контактные данные
            </Title>

            {!isAuthenticated && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f1f1f',
                  borderRadius: 6,
                  marginBottom: 20,
                  border: '1px solid #333',
                }}
              >
                <Text style={{ color: '#8c8c8c' }}>
                  Есть аккаунт?{' '}
                  <a
                    style={{ color: '#ff4d4f', cursor: 'pointer' }}
                    onClick={() => openAuthModal?.()}
                  >
                    Войдите
                  </a>
                  , чтобы сохранить заказ в личной истории.
                </Text>
              </div>
            )}

            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label={<Text style={{ color: '#fff' }}>Имя и Фамилия получателя</Text>}
                name="clientName"
                rules={[{ required: true, message: 'Укажите ФИО получателя' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#595959' }} />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={
                  <Text style={{ color: '#fff' }}>
                    <HomeOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                    Адрес доставки
                  </Text>
                }
                name="address"
                rules={[{ required: true, message: 'Укажите адрес доставки' }]}
              >
                <Input.TextArea
                  rows={3}
                />
              </Form.Item>

              <Button
                type="primary"
                danger
                size="large"
                block
                htmlType="submit"
                loading={loading}
                icon={<CheckCircleOutlined />}
                style={{ marginTop: 12 }}
              >
                Подтвердить и оплатить ({formatPrice(totalPrice)})
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card style={{ backgroundColor: '#141414', borderColor: '#262626' }}>
            <Title level={4} style={{ color: '#fff', marginTop: 0 }}>
              Ваш заказ
            </Title>
            <Divider style={{ borderColor: '#262626', margin: '12px 0' }} />

            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  alignItems: 'center',
                }}
              >
                <div style={{ maxWidth: '65%' }}>
                  <Text style={{ color: '#fff', display: 'block' }}>{item.name}</Text>
                  <Text style={{ color: '#8c8c8c', fontSize: 12 }}>Количество: {item.quantity}</Text>
                </div>
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </div>
            ))}

            <Divider style={{ borderColor: '#262626', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                Итого к оплате:
              </Title>
              <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                {formatPrice(totalPrice)}
              </Title>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}