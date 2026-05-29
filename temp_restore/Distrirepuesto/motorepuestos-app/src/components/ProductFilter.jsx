import React, { useState } from 'react';
import { categories } from '../data';
import './ProductFilter.css';

const ProductFilter = ({ onSearch, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('todos');

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if(onCategoryChange) onCategoryChange(categoryId);
  };

  return (
    <div className="product-filter">
      <div className="container filter-container">
        <div className="search-bar-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por producto, marca o compatibilidad..." 
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
        
        <div className="categories-wrapper">
          {categories.map(category => (
            <button 
              key={category.id} 
              className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
