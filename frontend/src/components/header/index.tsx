import React from 'react';
import { Layout, Menu, Input, Button, Badge, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './header.module.css';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const location = useLocation();
  const getSelectedKey = () => {
    const pathname = location.pathname;
    if (pathname === '/list-pc') return ['assemblies'];
    if (pathname === '/assebly-pc' || pathname === '/assembly-pc') return ['configurator'];
    return ['main'];
  };

  const navItems = [
    {
      key: 'main',
      label: <Link to="/">Главная</Link>,
    },
    {
      key: 'assemblies',
      label: <Link to="/list-pc">Готовые ПК</Link>,
    },
    {
      key: 'configurator',
      label: <Link to="/assembly-pc">Конфигуратор</Link>,
    },
    {
      key: 'services',
      label:<Link to="/">Услуги</Link>,
    },
    {
      key: 'contacts',
      label: <Link to="/">Контакты</Link>,
    },
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
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          HYPER<span>PC</span>
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