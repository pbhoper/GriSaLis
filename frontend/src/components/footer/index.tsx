import React from 'react';
import { Layout, Row, Col } from 'antd';
import styles from './footer.module.css';

const { Footer: AntFooter } = Layout;

export const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <h3 style={{ color: '#fff' }}>GriSaLis</h3>
          <p>Производитель мощных компьютеров и премиальных игровых систем.</p>
        </Col>
        <Col xs={12} md={8}>
          <h4 style={{ color: '#fff' }}>Навигация</h4>
          <p>Конфигуратор</p>
          <p>Готовые сборки</p>
          <p>Гарантия и сервис</p>
        </Col>
        <Col xs={12} md={8}>
          <h4 style={{ color: '#fff' }}>Контакты</h4>
          <p>info@grisalis.by</p>
          <p>8 (800) 775-82-40</p>
        </Col>
      </Row>
      <div className={styles.copyright}>
        © 2026 GriSaLis. Все права защищены.
      </div>
    </AntFooter>
  );
};

export default Footer;