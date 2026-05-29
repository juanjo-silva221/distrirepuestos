import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="logo logo-footer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <h2>MotoRepuestos</h2>
          </div>
          <p>Repuestos originales y genéricos para tu motocicleta. Calidad garantizada.</p>
        </div>
        
        <div className="footer-links">
          <h3>Categorías</h3>
          <ul>
            <li><a href="#">Motor</a></li>
            <li><a href="#">Frenos</a></li>
            <li><a href="#">Transmisión</a></li>
            <li><a href="#">Suspensión</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h3>Ayuda</h3>
          <ul>
            <li><a href="#">Preguntas Frecuentes</a></li>
            <li><a href="#">Envíos y Entregas</a></li>
            <li><a href="#">Garantías</a></li>
            <li><a href="#">Devoluciones</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>Contacto</h3>
          <p>WhatsApp: +57 300 123 4567</p>
          <p>Email: info@motorepuestos.com</p>
          <p>Horario: Lun-Sáb 8am-6pm</p>
          <p>Bogotá, Colombia</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 MotoRepuestos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
