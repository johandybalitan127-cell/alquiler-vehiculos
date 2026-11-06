import React from 'react';

const navGroups = [
  {
    groupTitle: 'PANEL PRINCIPAL',
    items: [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
        )
      },
      {
        id: 'catalogo',
        label: 'Galería de Autos',
        countKey: 'vehiculos',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      }
    ]
  },
  {
    groupTitle: 'OPERACIONES DE FLOTA',
    items: [
      {
        id: 'alquileres',
        label: 'Alquileres',
        countKey: 'alquileres',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      },
      {
        id: 'vehiculos',
        label: 'Vehículos',
        countKey: 'vehiculos',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
        )
      },
      {
        id: 'clientes',
        label: 'Clientes',
        countKey: 'clientes',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
          </svg>
        )
      }
    ]
  },
  {
    groupTitle: 'EQUIPO & CONTROL',
    items: [
      {
        id: 'empleados',
        label: 'Equipo',
        countKey: 'empleados',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </svg>
        )
      },
      {
        id: 'operaciones',
        label: 'Reportes y Cotizador',
        countKey: 'controladores',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )
      }
    ]
  },
  {
    groupTitle: 'CONFIGURACIÓN',
    items: [
      {
        id: 'perfil',
        label: 'Mi Perfil & Agencia',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.5 18.5a6 6 0 0 1 11 0" />
          </svg>
        )
      }
    ]
  }
];

export default function Sidebar({
  activeSection,
  setActiveSection,
  counts,
  profile,
  isOpen,
  onClose
}) {
  const handleSelect = (id) => {
    setActiveSection(id);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div
          className="sidebar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => handleSelect('perfil')}
          title="Ver sección de perfil"
        >
          <div className="brand-logo-frame">
            <img
              src={profile?.avatar || '/logo-autorent.svg?v=fios'}
              alt="Logo Rent Car Fios"
              className="brand-logo-img"
              onError={(e) => {
                e.currentTarget.src = '/logo-autorent.svg?v=fios';
              }}
            />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-title">{profile?.nombre || 'Rent Car Fios'}</span>
            </div>
            <span className="brand-subtitle">{profile?.rol || 'Flota Ejecutiva · Costa Rica'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div className="sidebar-group" key={group.groupTitle}>
              <span className="sidebar-group-title">{group.groupTitle}</span>
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                const countVal = item.countKey ? counts[item.countKey] : null;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    <span className="sidebar-link-label">{item.label}</span>
                    {countVal !== null && (
                      <span className="sidebar-badge">{countVal}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-db-status">
            <div className="sidebar-db-row">
              <span className="sidebar-pulse-dot" />
              <span className="sidebar-db-title">MySQL 8.0 Activo</span>
            </div>
            <span className="sidebar-db-meta">15 Entidades & 15 Controladores</span>
          </div>

          <div className="sidebar-note">
            <p className="note-title">{profile?.sucursal || 'Sucursal Central, San José'}</p>
            <p className="note-sub">CRC (₡) · IVA 13% Incluido</p>
          </div>
        </div>
      </aside>
    </>
  );
}
