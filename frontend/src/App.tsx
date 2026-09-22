import React from 'react';
import { ConfigProvider, theme, Layout } from 'antd';
import { apolloClient } from './lib/apollo-client';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header';
import Main from './components/main';
import Services from './components/services';
import Contacts from './components/contacts';
import Footer from './components/footer';
import AuthModal from './auth';
import {ApolloProvider} from "@apollo/client/react";

export const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#ff003c',
              colorBgContainer: '#141721',
              fontFamily: "'Inter', sans-serif",
            },
          }}
        >
          <Layout style={{ minHeight: '100vh', background: '#0b0c10' }}>
            <Header />
            <Layout.Content>
              <Main />
              <Services />
              <Contacts />
            </Layout.Content>
            <Footer />
            <AuthModal />
          </Layout>
        </ConfigProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;