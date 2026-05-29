import React, { useState } from 'react';
import { useCart } from '../context/cartContext';
import './Checkout.css';

const Checkout = ({ onBack, onComplete }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    metodoPago: 'efectivo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onComplete({
        customer: formData,
        items: cart.map((item) => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartTotal
      });

      clearCart();
      alert('Pedido realizado con exito');
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo completar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-content">
          <div className="checkout-form-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '0.5rem'}}>
              <h2 style={{margin: 0, borderBottom: 'none', paddingBottom: 0}}>Detalles de Facturacion</h2>
              <button className="checkout-close" onClick={onBack} style={{position: 'static', background: 'var(--bg-secondary, #f0f0f0)', borderRadius: '50%', padding: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Correo Electronico</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Telefono</label>
                  <input type="tel" id="telefono" name="telefono" required value={formData.telefono} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Direccion de Envio</label>
                <input type="text" id="direccion" name="direccion" required value={formData.direccion} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" required value={formData.ciudad} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Metodo de Pago</label>
                <div className="payment-methods">
                  <label className="radio-label">
                    <input type="radio" name="metodoPago" value="efectivo" checked={formData.metodoPago === 'efectivo'} onChange={handleChange} />
                    Efectivo contra entrega
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} />
                    Transferencia Bancaria
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-submit-order" disabled={isSubmitting || cart.length === 0}>
                {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>

              {errorMessage && (
                <p style={{ color: '#c53030', marginTop: '1rem', fontSize: '0.95rem' }}>
                  {errorMessage}
                </p>
              )}
            </form>
          </div>

          <div className="checkout-summary-section">
            <h2>Resumen del Pedido</h2>
            <div className="order-summary-list">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-title">{item.title}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="summary-row">
                <span>Envio</span>
                <span>Gratis</span>
              </div>
              <div className="summary-row total">
                <span>Total a Pagar</span>
                <span className="highlight-total">${cartTotal.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
