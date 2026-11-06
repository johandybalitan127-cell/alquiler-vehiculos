import React from 'react';
import { formatColones } from '../utils/vehicleImages';

export default function DetailModal({ isOpen, title, subtitle, fields = [], relatedRentals = [], onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{title}</h3>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="detail-grid">
          {fields.map((f, idx) => (
            <div className="detail-item" key={idx}>
              <span className="detail-label">{f.label}</span>
              <span className="detail-value">{f.value}</span>
            </div>
          ))}
        </div>

        {Array.isArray(relatedRentals) && relatedRentals.length > 0 && (
          <div className="detail-rentals-section">
            <h4 className="detail-section-heading">
              Historial de Alquileres Asociados ({relatedRentals.length})
            </h4>
            <div className="detail-rentals-list">
              {relatedRentals.map((alq) => (
                <div className="detail-rental-row" key={alq.id}>
                  <div>
                    <strong>Contrato #{alq.id}</strong>
                    <span className="detail-rental-dates">
                      {alq.fecha_inicio} → {alq.fecha_fin}
                    </span>
                  </div>
                  <div className="detail-rental-meta">
                    <span className="detail-rental-price">
                      {formatColones(alq.total)}
                    </span>
                    <span className={`badge badge-${(alq.estado || '').toLowerCase()}`}>
                      {alq.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}

