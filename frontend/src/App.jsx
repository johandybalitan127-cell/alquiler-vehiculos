import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CatalogoView from './components/CatalogoView';
import ClientesView from './components/ClientesView';
import VehiculosView from './components/VehiculosView';
import EmpleadosView from './components/EmpleadosView';
import AlquileresView from './components/AlquileresView';
import PerfilView from './components/PerfilView';
import CentroControladoresView from './components/CentroControladoresView';
import {
  clientesApi,
  vehiculosApi,
  empleadosApi,
  alquileresApi,
  operacionesApi
} from './services/api';
import './App.css';

const defaultProfile = {
  nombre: 'Rent Car Fios',
  rol: 'Perfil Oficial',
  correo: 'administracion@rentcarfios.cr',
  telefono: '+506 2250-1000',
  sucursal: 'Sucursal Central, San José',
  horario: 'Lunes a Sábado · 7:00 a.m. – 7:00 p.m.',
  biografia:
    'Rent Car Fios — Agencia especializada en alquiler de vehículos ejecutivos, SUV y flota corporativa en Costa Rica.',
  avatar: '/logo-autorent.svg?v=fios'
};

const sectionMeta = {
  dashboard: {
    title: 'Inicio',
    subtitle: 'Vista general de reservas, flota y clientes'
  },
  catalogo: {
    title: 'Galería de Vehículos',
    subtitle: 'Fotografías, tarifas y estado actual de los vehículos en alquiler'
  },
  clientes: {
    title: 'Clientes',
    subtitle: 'Directorio de clientes y datos de contacto'
  },
  vehiculos: {
    title: 'Vehículos',
    subtitle: 'Catálogo de autos, tarifas por día y disponibilidad'
  },
  empleados: {
    title: 'Equipo',
    subtitle: 'Personal administrativo y asesoras comerciales'
  },
  alquileres: {
    title: 'Alquileres',
    subtitle: 'Registro y control de contratos de alquiler'
  },
  operaciones: {
    title: 'Reportes, Cotizador y Controladores',
    subtitle: 'Centro operativo conectado a los 15 controladores del backend'
  },
  perfil: {
    title: 'Perfil de la Agencia',
    subtitle: 'Información corporativa, logotipo e imagen de perfil del sistema'
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('rentcarfios_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const handleSaveProfile = async (newProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('rentcarfios_profile', JSON.stringify(newProfile));
      await operacionesApi.actualizarPerfilAgencia(newProfile);
    } catch {
      // ignore storage or offline errors
    }
  };

  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [alquileres, setAlquileres] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = useCallback((type, message) => {
    setNotification({ type, message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [cData, vData, eData, aData] = await Promise.all([
        clientesApi.getAll(),
        vehiculosApi.getAll(),
        empleadosApi.getAll(),
        alquileresApi.getAll()
      ]);
      setClientes(Array.isArray(cData) ? cData : []);
      setVehiculos(Array.isArray(vData) ? vData : []);
      setEmpleados(Array.isArray(eData) ? eData : []);
      setAlquileres(Array.isArray(aData) ? aData : []);
    } catch (err) {
      setApiError(
        err.message ||
          'No se pudo conectar con el servidor (http://localhost:3000).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const counts = {
    clientes: clientes.length,
    vehiculos: vehiculos.length,
    empleados: empleados.length,
    alquileres: alquileres.length,
    controladores: 15
  };

  const currentMeta = sectionMeta[activeSection] || sectionMeta.dashboard;

  return (
    <div className="app-shell">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        counts={counts}
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="topbar-heading-group">
              <div className="topbar-breadcrumbs">
                <span className="breadcrumb-brand">Rent Car Fios</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{currentMeta.title}</span>
              </div>
              <h1 className="topbar-title">{currentMeta.title}</h1>
              <p className="topbar-subtitle">{currentMeta.subtitle}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-live-badge" title="Conexión activa con MySQL 8.0">
              <span className="pulse-dot" />
              <span className="live-badge-text">En línea · San José, CR · CRC ₡</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm topbar-action-btn"
              onClick={() => setActiveSection('alquileres')}
              title="Registrar nuevo contrato de alquiler"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Nuevo Alquiler</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm topbar-refresh-btn"
              onClick={fetchAllData}
              disabled={loading}
              title="Recargar datos del servidor"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="14"
                height="14"
                className={loading ? 'icon-spin' : ''}
              >
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
            </button>

            <button
              type="button"
              className={`page-profile-pill ${activeSection === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveSection('perfil')}
              title="Abrir sección de perfil y configuración de agencia"
            >
              <div className="page-profile-avatar-wrap">
                <img
                  src={profile.avatar || '/logo-autorent.svg'}
                  alt="Perfil AutoRent"
                  className="page-profile-avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/logo-autorent.svg';
                  }}
                />
                <span className="profile-online-dot" />
              </div>
              <div className="page-profile-info">
                <span className="page-profile-name">{profile.nombre}</span>
                <span className="page-profile-role">{profile.rol}</span>
              </div>
            </button>
          </div>
        </header>

        {notification && (
          <div className={`alert-banner alert-${notification.type}`} role="alert">
            <div className="alert-content">
              <span className="alert-badge">
                {notification.type === 'success' ? 'Listo' : 'Aviso'}
              </span>
              <span className="alert-text">{notification.message}</span>
            </div>
            <button
              type="button"
              className="alert-close"
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </div>
        )}

        {apiError && (
          <div className="connection-warning">
            <div>
              <strong>Sin conexión:</strong> {apiError}
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={fetchAllData}>
              Reintentar
            </button>
          </div>
        )}

        <main className="content-wrapper">
          {activeSection === 'dashboard' && (
            <Dashboard
              clientes={clientes}
              vehiculos={vehiculos}
              empleados={empleados}
              alquileres={alquileres}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === 'catalogo' && (
            <CatalogoView
              vehiculos={vehiculos}
              alquileres={alquileres}
              onNavigate={setActiveSection}
              notify={notify}
            />
          )}

          {activeSection === 'clientes' && (
            <ClientesView
              clientes={clientes}
              onRefresh={fetchAllData}
              notify={notify}
            />
          )}

          {activeSection === 'vehiculos' && (
            <VehiculosView
              vehiculos={vehiculos}
              onRefresh={fetchAllData}
              notify={notify}
            />
          )}

          {activeSection === 'empleados' && (
            <EmpleadosView
              empleados={empleados}
              onRefresh={fetchAllData}
              notify={notify}
            />
          )}

          {activeSection === 'alquileres' && (
            <AlquileresView
              alquileres={alquileres}
              clientes={clientes}
              vehiculos={vehiculos}
              empleados={empleados}
              onRefresh={fetchAllData}
              notify={notify}
            />
          )}

          {activeSection === 'operaciones' && (
            <CentroControladoresView
              vehiculos={vehiculos}
              onRefresh={fetchAllData}
              notify={notify}
            />
          )}

          {activeSection === 'perfil' && (
            <PerfilView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              clientes={clientes}
              vehiculos={vehiculos}
              empleados={empleados}
              alquileres={alquileres}
              onNavigate={setActiveSection}
              notify={notify}
            />
          )}
        </main>
      </div>
    </div>
  );
}
