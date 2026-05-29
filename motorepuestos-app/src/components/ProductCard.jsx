import React from 'react';
import { useCart } from '../context/cartContext';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();
  return (
    <div className="product-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-badges">
          <span className="stock-badge">Nuevo ({product.stock})</span>
          <span className="category-tag">{product.category}</span>
        </div>
      </div>
      
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-title">{product.title}</h3>
        
        <p className="product-specs">
          <span className="specs-icon">⛭</span> {product.specs}
        </p>
        
        <div className="product-pricebox">
          <span className="product-price">${product.price.toLocaleString('es-CO')}</span>
          <span className="product-tax">IVA incluido</span>
        </div>
        
        <button className="btn-add-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
