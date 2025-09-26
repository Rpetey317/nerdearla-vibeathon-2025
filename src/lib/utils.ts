import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Helper function to safely convert input to Date object
function ensureDate(input: Date | string | number | null | undefined): Date {
  // Handle null/undefined cases
  if (input === null || input === undefined) {
    console.warn('Null or undefined date input, using current date');
    return new Date();
  }
  
  if (input instanceof Date) {
    // Check if it's a valid Date object
    if (isNaN(input.getTime())) {
      console.warn('Invalid Date object:', input);
      return new Date();
    }
    return input;
  }
  
  if (typeof input === 'string' || typeof input === 'number') {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date input:', input);
      return new Date(); // Return current date as fallback
    }
    return date;
  }
  
  console.warn('Unexpected date input type:', typeof input, input);
  return new Date(); // Return current date as fallback
}

export function formatDate(date: Date | string | number | null | undefined): string {
  const dateObj = ensureDate(date);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatShortDate(date: Date | string | number | null | undefined): string {
  const dateObj = ensureDate(date);
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600 bg-green-100';
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

export function getStatusColor(status: string): string {
  switch (status) {
    // Attendance statuses
    case 'present':
      return 'text-green-600 bg-green-100';
    case 'absent':
      return 'text-red-600 bg-red-100';
    case 'late':
      return 'text-yellow-600 bg-yellow-100';
    
    // Assignment statuses (Spanish - matching Semillero's terminology)
    case 'sin_entregar':
      return 'text-red-600 bg-red-100';
    case 'asignado':
      return 'text-blue-600 bg-blue-100';
    case 'borrador':
      return 'text-yellow-600 bg-yellow-100';
    case 'entregado':
      return 'text-green-600 bg-green-100';
    case 'evaluado':
      return 'text-green-700 bg-green-200';
    case 'tarde':
      return 'text-orange-600 bg-orange-100';
    
    // Legacy English statuses (for backwards compatibility)
    case 'submitted':
      return 'text-blue-600 bg-blue-100';
    case 'graded':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'sin_entregar':
      return 'Sin Entregar';
    case 'asignado':
      return 'Asignado';
    case 'borrador':
      return 'Borrador';
    case 'entregado':
      return 'Entregado';
    case 'evaluado':
      return 'Evaluado';
    case 'tarde':
      return 'Entrega Tardía';
    case 'submitted':
      return 'Entregado';
    case 'graded':
      return 'Evaluado';
    case 'pending':
      return 'Pendiente';
    default:
      return 'Desconocido';
  }
}
