import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductFilter from './components/ProductFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { products } from './data';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import './index.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter products based on search query and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple category matching - 'todos' shows all, otherwise match exact string
    // In our mock, categories are capitalized like 'Motor', and ids are like 'motor'
    const matchesCategory = activeCategory === 'todos' || 
                            product.category.toLowerCase() === activeCategory;
                            
    return matchesSearch && matchesCategory;
  });

  return (
    <CartProvider>
      <Header />
      <Hero />
      <main>
        <ProductFilter 
          onSearch={setSearchQuery} 
          onCategoryChange={setActiveCategory} 
        />
        <ProductGrid 
          products={filteredProducts} 
          onProductClick={setSelectedProduct} 
        />
      </main>
      <Footer />
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
      <ProductDetails 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
      {isCheckoutOpen && (
        <Checkout 
          onBack={() => setIsCheckoutOpen(false)} 
          onComplete={() => {
            setIsCheckoutOpen(false);
            alert('¡Pedido realizado con éxito!');
          }} 
        />
      )}
    </CartProvider>
  );
}

export default App;
