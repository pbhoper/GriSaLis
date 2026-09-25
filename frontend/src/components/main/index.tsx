import React from 'react';
import { Typography, Row, Col, Card, Tag } from 'antd';
import styles from './main.module.css';

const { Title, Paragraph } = Typography;

export const Main: React.FC = () => {
  const featuredPcs = [
    { id: 1, name: 'GRISALIS LUMEN', price: 185000, gpu: 'RTX 4070 Ti Super', cpu: 'Intel i7-14700K' },
    { id: 2, name: 'GRISALIS CYBER', price: 340000, gpu: 'RTX 4090', cpu: 'Intel i9-14900KF' },
    { id: 3, name: 'GRISALIS PLAY', price: 120000, gpu: 'RTX 4060 Ti', cpu: 'AMD Ryzen 5 7600X' },
  ];

  return (
    <div className={styles.mainContainer}>
      <section className={styles.hero}>
        <Title className={styles.heroTitle}>
          Мощные игровые компьютеры
        </Title>
        <Paragraph className={styles.heroSub}>
          Бескомпромиссная производительность, кастомное охлаждение и эстетика премиум-класса.
        </Paragraph>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Флагманские сборки</div>
        <Row gutter={[24, 24]}>
          {featuredPcs.map((pc) => (
            <Col xs={24} sm={12} lg={8} key={pc.id}>
              <Card
                hoverable
                className={styles.pcCard}
                cover={
                  <img
                    alt={pc.name}
                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=600"
                    style={{ borderRadius: '12px 12px 0 0', height: 220, objectFit: 'cover' }}
                  />
                }
              >
                <Tag color="red" style={{ marginBottom: 12 }}>TOP SALES</Tag>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>{pc.name}</Title>
                <Paragraph style={{ color: '#8c8c8c', marginTop: 8 }}>
                  {pc.cpu} / {pc.gpu} / 32GB RAM
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                  <span className={styles.priceTag}>{pc.price.toLocaleString()} ₽</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default Main;