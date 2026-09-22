import React from 'react';
import { Layout, Menu, Input, Button, Badge, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import styles from './header.module.css';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { isAuthenticated, openAuthModal, logout } = useAuth();

  const navItems = [
    { key: 'main', label: 'Главная' },
    { key: 'assemblies', label: 'Готовые ПК' },
    { key: 'configurator', label: 'Конфигуратор' },
    { key: 'services', label: 'Услуги' },
    { key: 'contacts', label: 'Контакты' },
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

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo}>
        HYPER<span>PC</span>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['main']}
        items={navItems}
        className={styles.navMenu}
      />

      <div className={styles.actions}>
        <Input
          prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
          placeholder="Поиск ПК..."
          style={{ width: 220, borderRadius: 20 }}
        />
        <Badge count={0} color="#ff003c">
          <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: 20, color: '#fff' }} />} />
        </Badge>

        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="primary" ghost icon={<UserOutlined />}>
              Профиль
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" danger icon={<UserOutlined />} onClick={openAuthModal}>
            Войти
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;