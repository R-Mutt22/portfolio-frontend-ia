import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import {
  enviarConsulta,
  pingBackendHealth,
  type Mensaje,
} from '../services/chatService';

const MENSAJE_ERROR_GENERICO =
  'Ocurrió un error al consultar el asistente. Inténtalo de nuevo.';

const POOL_SUGERENCIAS = [
  // Arquitectura IA & Stack Principal
  '¿Cómo funciona este asistente con Spring AI?',
  '¿Cuál es su stack principal en Backend?',
  '¿Qué proyectos desarrolló con Java y Spring Boot?',

  // Proyectos Destacados (Métricas e Impacto)
  '¿Cómo escaló el backend para +125.000 usuarios?',
  '¿Qué rol tuvo en el hackathon Alumnithon 2025?',
  '¿Cómo construyó ArtBlink en Solana en 48 horas?',

  // Calidad, Accesibilidad y WPO
  '¿Qué herramientas usa en QA Automation?',
  '¿Cómo aplica accesibilidad WCAG y WPO?',

  // Perfil Híbrido (Arte, Antropología y Cultura)
  '¿Cómo cruza el arte y la antropología con el código?',
  '¿Qué hizo en FAER Festival y Casa de Piedra?',

  // Fit Cultural y Contacto
  '¿Qué tipo de equipo o proyecto busca hoy?',
  '¿Qué hace fuera de programar?',
];

function obtenerChipsAleatorios(cantidad = 4): string[] {
  const copia = [...POOL_SUGERENCIAS];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, cantidad);
}

export const ChatBot: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [esperaExtendida, setEsperaExtendida] = useState(false);
  const [chipsAleatorios, setChipsAleatorios] = useState<string[]>(() =>
    obtenerChipsAleatorios(4)
  );
  const [copiadoIdx, setCopiadoIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    pingBackendHealth(controller.signal);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando, esperaExtendida]);

  useEffect(() => {
    if (!cargando) {
      setEsperaExtendida(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setEsperaExtendida(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [cargando]);

  useEffect(() => {
    if (mensajes.length === 0) {
      setChipsAleatorios(obtenerChipsAleatorios(4));
    }
  }, [mensajes.length]);

  const enviarPregunta = async (textoPregunta: string) => {
    const textoLimpio = textoPregunta.trim();
    if (!textoLimpio || cargando) return;

    setInput('');
    setMensajes((prev) => [...prev, { emisor: 'usuario', texto: textoLimpio }]);
    setCargando(true);

    try {
      const respuestaIA = await enviarConsulta(textoLimpio);
      setMensajes((prev) => [...prev, { emisor: 'ia', texto: respuestaIA }]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          emisor: 'ia',
          texto: MENSAJE_ERROR_GENERICO,
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await enviarPregunta(input);
  };

  const handleCopiar = async (texto: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoIdx(idx);
      window.setTimeout(() => {
        setCopiadoIdx((prev) => (prev === idx ? null : prev));
      }, 2000);
    } catch {
      // No interrumpe la UI si el portapapeles no está disponible
    }
  };

  const puedeCopiarMensaje = (msg: Mensaje): boolean => {
    if (msg.emisor !== 'ia' || cargando) return false;
    const limpio = msg.texto.trim();
    return limpio.length > 0 && limpio !== MENSAJE_ERROR_GENERICO;
  };

  return (
    <div className="chat-layout">
      {/* Zona de contenido escroleable */}
      <div className="chat-scroll-area">
        {mensajes.length === 0 ? (
          <div className="hero-section">
            <h1 className="hero-title">¿Por dónde empezamos?</h1>
            <p className="hero-subtitle">
              Hazme cualquier pregunta sobre mi experiencia en Spring Boot, Solana o QA.
            </p>

            <div className="suggestion-chips">
              {chipsAleatorios.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="suggestion-chip"
                  disabled={cargando}
                  onClick={() => enviarPregunta(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
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
                    <>
                      <ReactMarkdown
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {msg.texto}
                      </ReactMarkdown>
                      {puedeCopiarMensaje(msg) && (
                        <div className="message-actions">
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={() => handleCopiar(msg.texto, idx)}
                          >
                            {copiadoIdx === idx ? 'Copiado ✓' : 'Copiar'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    msg.texto
                  )}
                </div>
              </div>
            ))}

            {/* Estado de carga progresivo con aclaración de latencia de Render */}
            {cargando && (
              <div className="chat-bubble ia">
                <div className="avatar-badge">✦</div>
                <div className="message-box loading-state">
                  <span>
                    {esperaExtendida
                      ? 'Despertando el servidor o procesando respuesta...'
                      : 'Pensando respuesta...'}
                  </span>
                  <small className="loading-subtext">
                    {esperaExtendida
                      ? 'En el plan gratuito de Render el arranque tras inactividad puede demorar unos segundos.'
                      : '(Si el servidor estaba inactivo, puede tardar en responder mientras se despierta)'}
                  </small>
                </div>
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
            maxLength={500}
          />
          <span className="char-counter">{input.length}/500</span>

          <button type="submit" disabled={cargando || !input.trim()} title="Enviar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};