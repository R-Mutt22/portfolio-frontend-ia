const API_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/chat';

export interface Mensaje {
  emisor: 'usuario' | 'ia';
  texto: string;
}

export async function enviarConsulta(pregunta: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pregunta }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error de comunicación con la IA');
  }

  return data.respuesta;
}