import React from 'react';
import { Row, Col, Typography, Descriptions, Tag } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from './contacts.module.css';

const { Title, Text } = Typography;

export const Contacts: React.FC = () => {
  return (
    <div className={styles.contactsContainer}>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Title level={2} style={{ color: '#fff' }}>Шоурум GriSaLis</Title>
          <Text style={{ color: '#8c8c8c' }}>
            Приезжайте в наш концептуальный магазин, протестируйте топовые ПК и обсудите сборку с экспертом.
          </Text>

          <div style={{ marginTop: 24 }}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span style={{ color: '#fff' }}><EnvironmentOutlined /> Адрес</span>}>
                <span style={{ color: '#a0a5b5' }}>офис в г.Минск</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#fff' }}><PhoneOutlined /> Телефон</span>}>
                <span style={{ color: '#ff003c', fontWeight: 'bold' }}>375 29 814 8029</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ color: '#fff' }}><ClockCircleOutlined /> Режим работы</span>}>
                <Tag color="green">Открыто</Tag> Ежедневно с 10:00 до 23:00
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className={styles.infoBlock}>
            <Title level={4} style={{ color: '#fff' }}>Запись на тест-драйв ПК</Title>
            <Text style={{ color: '#8c8c8c' }}>
              Выберите удобное время, и мы подготовим любой компьютер к вашему визиту.
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Contacts;