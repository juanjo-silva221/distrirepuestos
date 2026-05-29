import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import './Header.css';

const Header = ({ onAuthClick, onContactClick }) => {
  const { cartItemsCount, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-wrapper">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <div className="logo-text">
              <h1>Moto<span>Repuestos</span></h1>
              <p>Repuestos Originales y Genéricos</p>
            </div>
          </div>
        </div>

        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#inicio" className="nav-link" onClick={closeMenu}>Inicio</a>
          <a href="#productos" className="nav-link" onClick={closeMenu}>Productos</a>
          <button className="nav-link" onClick={() => { onContactClick(); closeMenu(); }}>Contáctanos</button>
          
          <button className="nav-link auth-btn-header" onClick={() => { onAuthClick(); closeMenu(); }}>
            Mi Cuenta
          </button>
        </nav>

        <div className="header-actions">
          <button className="cart-icon-btn" onClick={() => { openCart(); closeMenu(); }} aria-label="Abrir carrito">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
          
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
