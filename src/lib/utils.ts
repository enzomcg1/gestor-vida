/**
 * Formatea un número para mostrar en la interfaz de usuario
 * Elimina ceros innecesarios y agrega separadores de miles
 * 
 * @param value - El número a formatear
 * @returns El número formateado como string
 */
export function formatCurrency(value: number | string): string {
  // Convertir a número si es string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Si no es un número válido, retornar '0'
  if (isNaN(numValue)) {
    return '0';
  }
  
  // Formatear el número con separadores de miles
  // Usar toLocaleString con configuración para Paraguay
  return numValue.toLocaleString('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  });
}

/**
 * Formatea un número para mostrar en la interfaz de usuario con símbolo de guaraní
 * 
 * @param value - El número a formatear
 * @returns El número formateado con símbolo ₲
 */
export function formatGuaranies(value: number | string): string {
  return `₲${formatCurrency(value)}`;
}

/**
 * Formatea un porcentaje para mostrar en la interfaz de usuario
 * 
 * @param value - El número a formatear (ej: 0.25 para 25%)
 * @param decimals - Número de decimales a mostrar (por defecto 1)
 * @returns El porcentaje formateado
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (isNaN(value)) {
    return '0%';
  }
  
  return `${(value * 100).toFixed(decimals)}%`;
}
