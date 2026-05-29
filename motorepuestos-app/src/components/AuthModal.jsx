import React, { useState } from 'react';
import { loginUser, registerUser } from '../lib/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, view, onViewChange, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isLogin = view === 'login';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contrasenas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = isLogin
        ? await loginUser({
            email: formData.email,
            password: formData.password
          })
        : await registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password
          });

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo completar la autenticacion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-header">
          <h2>{isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}</h2>
          <p>{isLogin ? 'Ingresa para gestionar tus compras.' : 'Unete para acceder a los mejores repuestos.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej. Juan Perez"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electronico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contrasena</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contrasena</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
          </button>

          {errorMessage && (
            <p style={{ color: '#c53030', marginTop: '1rem', fontSize: '0.95rem' }}>
              {errorMessage}
            </p>
          )}
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{' '}
              <span className="auth-link" onClick={() => { setErrorMessage(''); onViewChange('register'); }}>
                Registrate aqui
              </span>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <span className="auth-link" onClick={() => { setErrorMessage(''); onViewChange('login'); }}>
                Inicia sesion
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
