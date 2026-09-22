import React, { useState } from 'react';
import { Modal, Tabs } from 'antd';
import { useAuth } from '../context/AuthContext';
import LoginForm from './login-form';
import RegisterForm from './register-form';

export const AuthModal: React.FC = () => {
  const { isModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeAuthModal}
      footer={null}
      centered
      destroyOnClose
      width={420}
      styles={{
        body: {
          background: '#141721',
          padding: '20px',
          borderRadius: '16px',
        },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'login' | 'register')}
        centered
        items={[
          {
            key: 'login',
            label: 'Вход',
            children: <LoginForm />,
          },
          {
            key: 'register',
            label: 'Регистрация',
            children: <RegisterForm onSuccess={() => setActiveTab('login')} />,
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;