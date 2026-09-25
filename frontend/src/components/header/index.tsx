import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Badge, Dropdown, List, Typography, Divider, AutoComplete } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './header.module.css';

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;

const GET_READY_PCS = gql`
  query readyPcs {
    readyPcs {
      id
      name
      price
    }
  }
`;

interface ReadyPc {
  id: string;
  name: string;
  price: number;
}

export const Header: React.FC = () => {
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const { cart, removeFromCart, totalPrice, totalCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const { data } = useQuery<{ readyPcs: ReadyPc[] }>(GET_READY_PCS);

  const getSelectedKey = () => {
    const pathname = location.pathname;
    if (pathname === '/list-pc') return ['assemblies'];
    if (pathname === '/assebly-pc' || pathname === '/assembly-pc') return ['configurator'];
    return ['main'];
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

  // Фильтрация вариантов для AutoComplete
  const searchOptions = (data?.readyPcs || [])
    .filter((pc) => pc.name.toLowerCase().includes(searchValue.toLowerCase()))
    .map((pc) => ({
      value: pc.name,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>{pc.name}</Text>
          <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{formatPrice(pc.price)}</Text>
        </div>
      ),
    }));

  const handleSelect = () => {
    setSearchValue('');
    navigate({ to: '/list-pc' as any });
  };

  const navItems = [
    { key: 'main', label: <Link to="/">Главная</Link> },
    { key: 'assemblies', label: <Link to="/list-pc">Готовые ПК</Link> },
    { key: 'configurator', label: <Link to="/assembly-pc">Конфигуратор</Link> },
    { key: 'services', label: <Link to="/">Услуги</Link> },
    { key: 'contacts', label: <Link to="/">Контакты</Link> },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      danger: true,
      onClick: logout,
    },
  ];

  const cartDropdownContent = (
    <div style={{ width: 340, padding: 16, backgroundColor: '#1f1f1f', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      <Title level={5} style={{ color: '#fff', marginTop: 0 }}>Корзина</Title>
      {cart.length === 0 ? (
        <Text style={{ color: '#8c8c8c' }}>Ваша корзина пуста</Text>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            style={{ maxHeight: 250, overflowY: 'auto' }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={<Text style={{ color: '#fff' }}>{item.name}</Text>}
                  description={
                    <Text style={{ color: '#ff4d4f' }}>
                      {item.quantity} x {formatPrice(item.price)}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
          <Divider style={{ borderColor: '#333', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#fff' }}>Итого:</Text>
            <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{formatPrice(totalPrice)}</Text>
          </div>
          <Button
            type="primary"
            danger
            block
            onClick={() => navigate({ to: '/checkout' as any })}
          >
            Оформить заказ
          </Button>
        </>
      )}
    </div>
  );

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          GriSaLis<span></span>
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKey()}
        items={navItems}
        className={styles.navMenu}
      />

      <div className={styles.actions}>
        <AutoComplete
          options={searchValue ? searchOptions : []}
          style={{ width: 240 }}
          onSearch={(text) => setSearchValue(text)}
          onSelect={handleSelect}
        >
          <Input
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            placeholder="Поиск ПК..."
            style={{ borderRadius: 20 }}
            allowClear
          />
        </AutoComplete>

        <Dropdown popupRender={() => cartDropdownContent} placement="bottomRight" trigger={['click']}>
          <Badge count={totalCount} color="#ff003c">
            <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />} />
          </Badge>
        </Dropdown>

        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="primary" ghost icon={<UserOutlined />}>
              Профиль
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            danger
            icon={<UserOutlined />}
            onClick={() => openAuthModal?.()}
          >
            Войти
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;