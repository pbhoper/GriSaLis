import React, { createContext, useContext, useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message, App } from 'antd';
import { gql, useMutation } from '@apollo/client';

// 1. GraphQL Мутации
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginAuthInput!) {
    login(input: $input) {
      accessToken
      userId
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterAuthInput!) {
    register(input: $input) {
      message
    }
  }
`;

interface AuthContextType {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  login: (token: string, userId: number) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // 2. Подключаем мутации Apollo Client
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const login = (accessToken: string, newUserId: number) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', String(newUserId));
    setToken(accessToken);
    setUserId(newUserId);
    setIsModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    message.info('Вы вышли из системы');
  };

  // 3. Настоящий логин через БД
  const handleLoginSubmit = async (values: any) => {
    try {
      const response = await loginMutation({
        variables: {
          input: {
            username: values.username,
            password: values.password,
          },
        },
      });

      const data = response.data?.login;
      if (data?.accessToken && data?.userId) {
        login(data.accessToken, Number(data.userId));
        message.success('Успешный вход в аккаунт!');
      }
    } catch (err: any) {
      console.error('Ошибка авторизации:', err);
      message.error(err.message || 'Неверный логин или пароль');
    }
  };

  // 4. Настоящая регистрация через БД
  const handleRegisterSubmit = async (values: any) => {
    try {
      const response = await registerMutation({
        variables: {
          input: {
            username: values.username,
            email: values.email,
            password: values.password,
          },
        },
      });

      const responseMessage = response.data?.register?.message || 'Регистрация прошла успешно!';
      message.success(responseMessage);

      // После успешной регистрации переключаем пользователя на вкладку входа
      setActiveTab('login');
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      message.error(err.message || 'Ошибка при регистрации');
    }
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Вход',
      children: (
        <Form layout="vertical" onFinish={handleLoginSubmit}>
          <Form.Item
            label="Имя пользователя или Email"
            name="username"
            rules={[{ required: true, message: 'Введите логин!' }]}
          >
            <Input placeholder="admin" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              type="primary"
              danger
              htmlType="submit"
              block
              size="large"
              loading={loginLoading}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: 'Регистрация',
      children: (
        <Form layout="vertical" onFinish={handleRegisterSubmit}>
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[{ required: true, message: 'Введите имя пользователя!' }]}
          >
            <Input placeholder="User123" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите Email!' },
              { type: 'email', message: 'Введите корректный Email!' },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            label="Повторите пароль"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              type="primary"
              danger
              htmlType="submit"
              block
              size="large"
              loading={registerLoading}
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: !!token,
        isModalOpen,
        login,
        logout,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
      }}
    >
      {children}

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
        centered
        width={400}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'login' | 'register')}
          centered
          items={tabItems}
        />
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};