import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { ToolOutlined, SafetyCertificateOutlined, RocketOutlined, AuditOutlined } from '@ant-design/icons';
import styles from './services.module.css';

const { Title, Paragraph } = Typography;

export const Services: React.FC = () => {
  const serviceList = [
    { icon: <ToolOutlined />, title: 'Кастомная сборка', desc: 'Профессиональная сборка с идеальным кабель-менеджментом.' },
    { icon: <RocketOutlined />, title: 'Разгон и оптимизация', desc: 'Максимизация FPS и тонкая настройка компонентов.' },
    { icon: <AuditOutlined />, title: 'Тестирование 24 ч.', desc: 'Стресс-тесты под полной нагрузкой перед передачей владельцу.' },
    { icon: <SafetyCertificateOutlined />, title: 'Гарантия 3 года', desc: 'Полное техническое обслуживание и поддержка в сервисе.' },
  ];

  return (
    <div className={styles.servicesContainer}>
      <Row gutter={[24, 24]}>
        {serviceList.map((srv, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card className={styles.serviceCard}>
              <div className={styles.iconWrapper}>{srv.icon}</div>
              <Title level={4} style={{ color: '#fff' }}>{srv.title}</Title>
              <Paragraph style={{ color: '#8c8c8c' }}>{srv.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;