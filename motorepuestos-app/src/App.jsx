import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductFilter from './components/ProductFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { CartProvider } from './context/CartProvider';
import CartDrawer from './components/CartDrawer';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import FloatingButtons from './components/FloatingButtons';
import AuthModal from './components/AuthModal';
import MyAccountModal from './components/MyAccountModal';
import ContactForm from './components/ContactForm';
import { createOrder, getOrders, getProducts } from './lib/api';
import './index.css';

function loadStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem('motorepuestos-user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error('Error parsing user from localStorage', error);
    return null;
  }
}

function App() {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(loadStoredUser);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setIsProductsLoading(true);
        const fetchedProducts = await getProducts();

        if (!isActive) {
          return;
        }

        setProducts(fetchedProducts);
        setProductsError('');
      } catch (error) {
        if (!isActive) {
          return;
        }

        setProductsError(error.message || 'No se pudieron cargar los productos');
      } finally {
        if (isActive) {
          setIsProductsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.email) {
      setOrders([]);
      return;
    }

    let isActive = true;

    const loadOrders = async () => {
      try {
        const fetchedOrders = await getOrders(currentUser.email);

        if (isActive) {
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error('Error loading orders', error);
      }
    };

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizedProductCategory = product.category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const matchesCategory =
      activeCategory === 'todos' || normalizedProductCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAccount = () => {
    if (currentUser) {
      setIsAccountOpen(true);
      return;
    }

    setAuthView('login');
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('motorepuestos-user', JSON.stringify(user));
    }

    setIsAuthOpen(false);
    setIsAccountOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOrders([]);
    setIsAccountOpen(false);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('motorepuestos-user');
    }
  };

  const handleCheckoutComplete = async (checkoutPayload) => {
    const createdOrder = await createOrder(checkoutPayload);
    setOrders((previousOrders) => [
      createdOrder,
      ...previousOrders.filter((order) => order.id !== createdOrder.id)
    ]);
    setIsCheckoutOpen(false);
    return createdOrder;
  };

  return (
    <CartProvider>
      <Header
        onAuthClick={handleOpenAccount}
        onContactClick={() => setIsContactOpen(true)}
      />
      <div id="inicio">
        <Hero />
      </div>
      <main id="productos">
        <ProductFilter
          onSearch={setSearchQuery}
          onCategoryChange={setActiveCategory}
        />
        <ProductGrid
          products={filteredProducts}
          isLoading={isProductsLoading}
          error={productsError}
          onProductClick={setSelectedProduct}
        />
      </main>
      <div id="contacto">
        <Footer />
      </div>
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      {isCheckoutOpen && (
        <Checkout
          onBack={() => setIsCheckoutOpen(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        view={authView}
        onViewChange={setAuthView}
        onLoginSuccess={handleLoginSuccess}
      />
      <MyAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onLogout={handleLogout}
        orders={orders}
      />
      <FloatingButtons />
      {isContactOpen && <ContactForm onClose={() => setIsContactOpen(false)} />}
    </CartProvider>
  );
}

export default App;
