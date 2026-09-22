import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { REGISTER_MUTATION } from '../graphql/auth';
import { useMutation } from '@apollo/client';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const onFinish = async (values: any) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName || null,
            username: values.username || null,
          },
        },
      });

      if (data?.register) {
        message.success(data.register.message);
        form.resetFields();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      message.error(err.message || 'Ошибка регистрации');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'Введите имя' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Имя" size="large" />
      </Form.Item>

      <Form.Item name="lastName">
        <Input prefix={<UserOutlined />} placeholder="Фамилия (опционально)" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[{ required: true, type: 'email', message: 'Введите корректный Email' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Введите пароль' },
          { min: 6, message: 'Пароль должен быть не менее 6 символов' },
        ]}
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
        Зарегистрироваться
      </Button>
    </Form>
  );
};

export default RegisterForm;