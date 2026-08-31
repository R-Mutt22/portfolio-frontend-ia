import React, { useState } from 'react';
import { enviarConsulta } from '../services/chatService';

interface Mensaje {
  emisor: 'usuario' | 'ia';
  texto: string;
}

export const ChatBot: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { emisor: 'ia', texto: '¡Hola! Soy el asistente de Matías. ¿Qué te gustaría saber sobre su experiencia o proyectos?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const consultaUsuario = input.trim();
    setInput('');
    setMensajes((prev) => [...prev, { emisor: 'usuario', texto: consultaUsuario }]);
    setCargando(true);

    try {
      const respuestaIA = await enviarConsulta(consultaUsuario);
      setMensajes((prev) => [...prev, { emisor: 'ia', texto: respuestaIA }]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        { emisor: 'ia', texto: 'Lo siento, ocurrió un error al procesar tu pregunta. Intenta nuevamente.' }
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {mensajes.map((msg, idx) => (
          <div key={idx} className={`mensaje ${msg.emisor}`}>
            <p>{msg.texto}</p>
          </div>
        ))}
        {cargando && <div className="mensaje ia"><p>Pensando respuesta...</p></div>}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: ¿Qué proyectos realizó en Solana?"
          disabled={cargando}
        />
        <button type="submit" disabled={cargando || !input.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
};