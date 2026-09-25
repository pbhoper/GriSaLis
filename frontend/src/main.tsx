import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ApolloProvider } from '@apollo/client';
import { ConfigProvider, theme } from 'antd';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './context/AuthContext';
import { client } from './graphql/client';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#ff4d4f',
                colorBgContainer: '#141414',
              },
            }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </AuthProvider>
      </ApolloProvider>
    </React.StrictMode>,
  );
}