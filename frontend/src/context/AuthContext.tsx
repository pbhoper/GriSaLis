import React, {
  createContext,
  useContext,
  useState
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Tabs,
  message
} from 'antd';

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

  const handleLoginSubmit = (values: any) => {
    login('demo-jwt-token-123', 1);
    message.success('Успешный вход!');
  };

  const handleRegisterSubmit = (values: any) => {
    login('demo-jwt-token-456', 2);
    message.success('Регистрация прошла успешно!');
  };

  const tabItems = [
    {
      key: 'login',
      label: 'Вход',
      children: (
        <Form layout="vertical" onFinish={handleLoginSubmit}>
          <Form.Item
            label="Email"
            name="username"
            rules={[{ required: true, message: 'Введите логин!' }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" danger htmlType="submit" block size="large">
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
            <Input/>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введите Email!' },
              { type: 'email', message: 'Введите корректный Email!' },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password/>
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
            <Input.Password/>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" danger htmlType="submit" block size="large">
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
        destroyOnClose
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