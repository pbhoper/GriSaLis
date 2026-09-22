import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { LOGIN_MUTATION } from '../graphql/auth';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@apollo/client';

export const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const onFinish = async (values: any) => {
    try {
      const { data } = await loginMutation({
        variables: { input: { email: values.email, password: values.password } },
      });

      if (data?.login) {
        login(data.login.accessToken, data.login.userId);
        message.success('Успешный вход в систему!');
        form.resetFields();
      }
    } catch (err: any) {
      message.error(err.message || 'Ошибка входа');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, type: 'email', message: 'Введите корректный Email' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
      </Form.Item>

      <Button
        type="primary"
        danger
        htmlType="submit"
        block
        size="large"
        loading={loading}
        style={{ marginTop: 10, fontWeight: 600 }}
      >
        Войти
      </Button>
    </Form>
  );
};

export default LoginForm;