// Mapa de imágenes de alta calidad para cada marca/modelo de vehículo
const BRAND_IMAGES = {
  toyota: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  hyundai: 'https://images.unsplash.com/photo-1633695276228-7a26f7b0f30e?auto=format&fit=crop&w=800&q=80',
  audi: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
  kia: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
  mercedes: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  nissan: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80',
  honda: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
  mazda: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  ford: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  chevrolet: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  volkswagen: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
};

const FALLBACK_GALLERY = [
  '/flota-autorent.jpg',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'
];

export function getVehicleImage(vehiculo) {
  if (!vehiculo) return '/flota-autorent.jpg';

  // Permitir imagen personalizada guardada en localStorage por placa/id
  try {
    const customMap = JSON.parse(localStorage.getItem('autorent_custom_images') || '{}');
    if (vehiculo.placa && customMap[vehiculo.placa]) {
      return customMap[vehiculo.placa];
    }
  } catch {
    // ignore storage errors
  }

  const marcaLower = (vehiculo.marca || '').toLowerCase();
  for (const [key, url] of Object.entries(BRAND_IMAGES)) {
    if (marcaLower.includes(key)) {
      return url;
    }
  }

  const idx = (Number(vehiculo.id) || 0) % FALLBACK_GALLERY.length;
  return FALLBACK_GALLERY[idx];
}

export function saveCustomVehicleImage(placa, imageUrl) {
  if (!placa || !imageUrl) return;
  try {
    const customMap = JSON.parse(localStorage.getItem('autorent_custom_images') || '{}');
    customMap[placa.trim().toUpperCase()] = imageUrl.trim();
    localStorage.setItem('autorent_custom_images', JSON.stringify(customMap));
  } catch {
    // ignore
  }
}

export function formatColones(value) {
  const num = Number(value || 0);
  return `₡${num.toLocaleString('es-CR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}


