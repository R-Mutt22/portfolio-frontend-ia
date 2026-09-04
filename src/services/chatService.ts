export interface Mensaje {
  emisor: 'usuario' | 'ia';
  texto: string;
}

// Usa la variable de entorno de Astro o como respaldo la URL pública en Render
const API_URL = import.meta.env.PUBLIC_BACKEND_URL || 'https://portfolio-backend-ia.onrender.com/api/chat';

export async function enviarConsulta(pregunta: string): Promise<string> {
  // 1. Validación de seguridad extra antes de consumir la red
  if (!pregunta || pregunta.trim().length > 500) {
    throw new Error('La consulta no es válida o excede el límite de 500 caracteres.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pregunta: pregunta.trim() }),
  });

  // 2. Manejo seguro si la respuesta no es exitosa (HTTP status != 200)
  if (!response.ok) {
    let mensajeError = 'Error de comunicación con el servidor';
    try {
      const dataError = await response.json();
      mensajeError = dataError.error || mensajeError;
    } catch {
      // Si el backend devuelve un HTML de error en vez de JSON
    }
    throw new Error(mensajeError);
  }

  const data = await response.json();
  return data.respuesta;
}