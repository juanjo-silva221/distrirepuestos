import React, { useState } from 'react';
import { createContactMessage } from '../lib/api';
import './ContactForm.css';

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    observaciones: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await createContactMessage(formData);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-overlay">
      <div className="contact-page-container">
        <button className="contact-close-btn" onClick={onClose} aria-label="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="contact-content-wrapper">
          <div className="contact-info-section">
            <div className="contact-info-header">
              <h2>¿Tienes alguna duda?</h2>
              <p>Estamos aqui para ayudarte. Dejanos tus datos y nos pondremos en contacto contigo lo antes posible para asesorarte con los mejores repuestos.</p>
            </div>

            <div className="contact-features">
              <div className="feature-item">
                <span className="feature-icon">📞</span>
                <div>
                  <h4>Atencion Telefonica</h4>
                  <p>Lunes a Viernes, 8am - 6pm</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✉️</span>
                <div>
                  <h4>Respuesta Rapida</h4>
                  <p>Menos de 24 horas habiles</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <div>
                  <h4>Asesoria Tecnica</h4>
                  <p>Expertos en repuestos multimarca</p>
                </div>
              </div>
            </div>

            <div className="contact-image-bg"></div>
          </div>

          <div className="contact-form-section">
            {isSuccess ? (
              <div className="contact-success">
                <div className="success-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>¡Mensaje Enviado!</h3>
                <p>Tus datos han sido registrados exitosamente en nuestra base de datos. Te contactaremos muy pronto.</p>
              </div>
            ) : (
              <>
                <h3 className="form-title">Envianos un Mensaje</h3>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Juan Perez"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Telefono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej. 300 123 4567"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">Correo Electronico</label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="Ej. juan@correo.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="observaciones">Observaciones o Repuestos Buscados</label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      placeholder="Describe que necesitas o tu duda..."
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="loader-inline"></span>
                    ) : (
                      <>
                        Enviar Mensaje
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </>
                    )}
                  </button>

                  {errorMessage && (
                    <p style={{ color: '#c53030', marginTop: '1rem', fontSize: '0.95rem' }}>
                      {errorMessage}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
