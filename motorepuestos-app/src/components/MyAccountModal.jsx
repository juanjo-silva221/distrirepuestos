import React, { useState } from 'react';
import './MyAccountModal.css';

const MyAccountModal = ({ isOpen, onClose, onLogout, orders = [] }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  if (!isOpen) return null;

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null;

  return (
    <div className="account-modal-overlay" onClick={onClose}>
      <div className="account-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="account-header">
          <h2>Mi Cuenta</h2>
          <div className="account-header-actions">
            <button className="logout-btn" onClick={onLogout}>Cerrar Sesion</button>
            <button className="close-account-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="account-body">
          <div className="orders-sidebar">
            <h3>Mis Pedidos</h3>
            <div className="orders-list">
              {orders.length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--light-text)' }}>
                  Aun no tienes pedidos.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`order-card ${(selectedOrder && selectedOrder.id === order.id) ? 'active' : ''}`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <div className="order-card-header">
                      <span className="order-id">{order.id}</span>
                      <span className={`order-status ${order.status === 'Entregado' ? 'status-delivered' : 'status-transit'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-card-details">
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                      <span>${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="order-details-pane">
            {selectedOrder ? (
              <>
                <div className="details-header">
                  <h3>Detalle del Pedido: {selectedOrder.id}</h3>
                  <p>Fecha: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>

                <div className="tracking-container">
                  <h4>Rastreo de Envio</h4>
                  <div className="tracking-timeline">
                    {selectedOrder.trackingSteps.map((step, index) => (
                      <div key={index} className={`tracking-step ${step.completed ? 'completed' : 'pending'}`}>
                        <div className="step-indicator">
                          <div className="step-circle">
                            {step.completed && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          {index < selectedOrder.trackingSteps.length - 1 && <div className="step-line"></div>}
                        </div>
                        <div className="step-info">
                          <p className="step-label">{step.label}</p>
                          <span className="step-date">{step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-items-list">
                  <h4>Articulos</h4>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <span className="item-name">{item.quantity}x {item.name}</span>
                      <span className="item-price">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="order-total-row">
                    <span>Total</span>
                    <span>${selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-order-selected">
                <p>Selecciona un pedido para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountModal;
