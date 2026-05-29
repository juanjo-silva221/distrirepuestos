import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, onProductClick }) => {
  return (
    <div className="product-grid-section">
      <div className="container">
        <div className="grid-header">
          <p className="results-count">Mostrando <span className="font-bold">{products.length}</span> productos</p>
        </div>
        
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
