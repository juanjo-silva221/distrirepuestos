import React, { useEffect } from 'react';
import { useCart } from '../context/cartContext';
import './ProductDetails.css';

const ProductDetails = ({ product, onClose }) => {
  const { addToCart } = useCart();

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div className="product-details-modal" onClick={e => e.stopPropagation()}>
        <div className="details-content">
          <div className="details-image-section">
            <img src={product.image} alt={product.title} className="details-image" />
          </div>
          
          <div className="details-info-section">
            <div className="details-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <span className="details-brand">{product.brand}</span>
                <h2>{product.title}</h2>
                <span className="details-category">{product.category}</span>
              </div>
              <button className="details-close" onClick={onClose} style={{position: 'static', background: 'var(--bg-secondary, #f0f0f0)', borderRadius: '50%', padding: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="details-price-box">
              <span className="details-price">${product.price.toLocaleString('es-CO')}</span>
              <span className="details-tax">IVA incluido</span>
            </div>
            
            <div className="details-specs">
              <h3>Especificaciones</h3>
              <ul>
                <li><strong>Detalle:</strong> {product.specs}</li>
                <li><strong>Disponibilidad:</strong> {product.stock > 0 ? `En Stock (${product.stock} unidades)` : 'Agotado'}</li>
                <li><strong>Garantía:</strong> 6 meses</li>
              </ul>
            </div>
            
            <div className="details-description">
              <h3>Descripción</h3>
              <p>Repuesto de alta calidad fabricado bajo los estándares más exigentes. Diseñado específicamente para garantizar el máximo rendimiento y durabilidad en su motocicleta. Ideal para reemplazo original o mejora de sistema.</p>
            </div>
            
            <button 
              className="btn-add-cart-large" 
              onClick={() => { addToCart(product); onClose(); }}
              disabled={product.stock === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
