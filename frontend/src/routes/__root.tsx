import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CartProvider } from '@/context/CartContext';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <CartProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
        }}
      >
        <Header />
        <main style={{ flex: '1 0 auto' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}