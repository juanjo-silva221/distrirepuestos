import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        <div className="hero-content">
          <div className="hero-badge-special">
            <span>✨</span> Ofertas Especiales Disponibles
          </div>
          
          <h1 className="hero-title">
            Repuestos de<br />
            <span className="text-primary">Alta Calidad</span><br />
            para tu Moto
          </h1>
          
          <p className="hero-description">
            Encuentra los mejores repuestos originales y genéricos. 
            Garantía extendida en todos nuestros productos.
          </p>
          
          <div className="hero-features">
            <div className="feature-pill">📦 Envío Gratis +$100.000</div>
            <div className="feature-pill">🔧 Garantía 12 Meses</div>
            <div className="feature-pill">⚙️ Instalación Incluida</div>
          </div>
          
          <div className="hero-actions">
            <button className="btn-primary hero-btn">
              Ver Catálogo Completo 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div className="hero-secondary-input"></div>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15k+</span>
              <span className="stat-label">Clientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfacción</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-container">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/BMW_S_1000_RR_-_BMW_M_1000_RR_50_Years_M_%2822121615413%29.jpg/1280px-BMW_S_1000_RR_-_BMW_M_1000_RR_50_Years_M_%2822121615413%29.jpg" 
              alt="BMW S1000RR" 
              className="hero-image"
            />
            <div className="floating-badge">
              <div className="floating-badge-icon">🔧</div>
              <div className="floating-badge-text">
                <span className="badge-title">-30%</span>
                <span className="badge-subtitle">En kits completos</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Wave SVG transition */}
      <div className="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L80,117.3C160,139,320,181,480,186.7C640,192,800,160,960,138.7C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
