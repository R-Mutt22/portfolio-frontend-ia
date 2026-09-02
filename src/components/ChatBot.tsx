import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { enviarConsulta, type Mensaje } from '../services/chatService';

export const ChatBot: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || cargando) return;

    const textoUsuario = input.trim();
    setInput('');
    setMensajes((prev) => [...prev, { emisor: 'usuario', texto: textoUsuario }]);
    setCargando(true);

    try {
      const respuestaIA = await enviarConsulta(textoUsuario);
      setMensajes((prev) => [...prev, { emisor: 'ia', texto: respuestaIA }]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        { emisor: 'ia', texto: 'Ocurrió un error al consultar el asistente. Inténtalo de nuevo.' }
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="chat-layout">
      {/* Zona de contenido escroleable */}
      <div className="chat-scroll-area">
        {mensajes.length === 0 ? (
          <div className="hero-section">
            <h1 className="hero-title">¿Por dónde empezamos?</h1>
            <p className="hero-subtitle">Hazme cualquier pregunta sobre mi experiencia en Spring Boot, Solana o QA.</p>
          </div>
        ) : (
          <div className="chat-history">
            {mensajes.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.emisor}`}>
                <div className="avatar-badge">
                  {msg.emisor === 'usuario' ? 'Tú' : '✦'}
                </div>
                <div className="message-box">
                  {msg.emisor === 'ia' ? (
                    <ReactMarkdown>{msg.texto}</ReactMarkdown>
                  ) : (
                    msg.texto
                  )}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="chat-bubble ia">
                <div className="avatar-badge">✦</div>
                <div className="message-box loading-state">Pensando respuesta...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input de búsqueda fijo abajo */}
      <div className="input-bar-wrapper">
        <form onSubmit={handleSubmit} className="input-bar">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a la IA sobre mi perfil..."
            disabled={cargando}
          />
          <button type="submit" disabled={cargando || !input.trim()} title="Enviar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};