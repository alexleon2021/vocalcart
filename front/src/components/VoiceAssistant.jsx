import { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { NetworkErrorHelper } from './NetworkErrorHelper';
import './VoiceAssistant.css';

/**
 * Componente de Asistente de Voz
 * Panel de control flotante con funcionalidades de voz
 */
export const VoiceAssistant = ({ onCommand }) => {
  const {
    isListening,
    transcript,
    voiceStatus,
    selectedVoice,
    voiceSpeed,
    isVoiceEnabled,
    chatMessages,
    speak,
    toggleListening,
    setSelectedVoice,
    setVoiceSpeed,
    setIsVoiceEnabled,
    clearChat,
  } = useVoiceAssistant();

  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);

  // Detectar error de red y mostrar helper
  useEffect(() => {
    if (voiceStatus && voiceStatus.toLowerCase().includes('error de red')) {
      setShowNetworkError(true);
    }
  }, [voiceStatus]);

  // Procesar comandos de voz
  const handleTranscript = (text) => {
    if (text && onCommand) {
      onCommand(text);
    }
  };

  // Efecto para procesar nuevos transcripts
  useEffect(() => {
    if (transcript) {
      handleTranscript(transcript);
    }
  }, [transcript]);

  const toggleModal = () => setShowModal(!showModal);
  const toggleHelp = () => setShowHelp(!showHelp);

  return (
    <>
      {/* Panel de control flotante */}
      <div className="voice-control-panel">
        <div className="voice-panel-header">
          <h5>🎙️ Asistente de Voz</h5>
          <button 
            className="btn-close-panel"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            title={isVoiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          >
            {isVoiceEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        <div className="voice-controls">
          {/* Instrucciones Push-to-Talk */}
          <div className="push-to-talk-instructions">
            <h6>⌨️ Push-to-Talk Activado</h6>
            <p>
              <strong>Mantén presionada la BARRA ESPACIADORA</strong> mientras hablas.
              <br />
              Suéltala cuando termines de hablar.
            </p>
          </div>

          {/* Indicador de estado */}
          <div className="voice-status">
            <div className={`status-indicator ${isListening ? 'active' : ''}`}></div>
            <span>{voiceStatus}</span>
          </div>

          {/* Display de transcripción en tiempo real */}
          {transcript && (
            <div className="transcript-display">
              <h6>📝 Lo que dijiste:</h6>
              <p className="transcript-text">{transcript}</p>
            </div>
          )}

          {/* Control de velocidad */}
          <div className="voice-speed-control">
            <label>
              <i className="fas fa-tachometer-alt"></i>
              Velocidad: {voiceSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="speed-slider"
            />
          </div>

          {/* Selector de tipo de voz */}
          <div className="voice-type-selector">
            <label>
              <i className="fas fa-user-circle"></i>
              Tipo de Voz:
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="voice-select"
            >
              <option value="predeterminada">Predeterminada</option>
              <option value="femenina">Femenina</option>
              <option value="masculina">Masculina</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="voice-actions">
            <button
              className="btn-action"
              onClick={toggleModal}
              title="Abrir asistente"
            >
              <i className="fas fa-comments"></i>
              Chat
            </button>
            <button
              className="btn-action"
              onClick={toggleHelp}
              title="Ayuda"
            >
              <i className="fas fa-question-circle"></i>
              Ayuda
            </button>
          </div>
        </div>
      </div>

      {/* Modal del asistente */}
      {showModal && (
        <div className="voice-modal-overlay" onClick={toggleModal}>
          <div className="voice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>🤖 Asistente de Voz</h4>
              <button className="btn-close" onClick={toggleModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="chat-container">
                <div className="chat-messages">
                  {chatMessages.length === 0 ? (
                    <div className="welcome-message">
                      <i className="fas fa-robot"></i>
                      <p>¡Hola! Soy tu asistente de compras por voz.</p>
                      <p>Puedes decir comandos como:</p>
                      <ul>
                        <li>"Agregar manzanas al carrito"</li>
                        <li>"Ver carrito"</li>
                        <li>"Buscar frutas"</li>
                        <li>"Leer productos disponibles"</li>
                      </ul>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`chat-message ${msg.sender}`}
                      >
                        <div className="message-avatar">
                          {msg.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">
                          <p>{msg.message}</p>
                          <span className="message-time">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-actions">
                  <button
                    className="btn-clear-chat"
                    onClick={clearChat}
                  >
                    <i className="fas fa-trash"></i>
                    Limpiar chat
                  </button>
                </div>
              </div>

              {/* Comandos disponibles */}
              <div className="commands-list">
                <h5>📋 Comandos Disponibles:</h5>
                <ul>
                  <li><strong>"agregar manzanas"</strong> - Añadir al carrito</li>
                  <li><strong>"agregar leche"</strong> - Añadir lácteos</li>
                  <li><strong>"ver carrito"</strong> - Mostrar carrito</li>
                  <li><strong>"buscar frutas"</strong> - Buscar productos</li>
                  <li><strong>"leer productos"</strong> - Listar todos</li>
                  <li><strong>"vaciar carrito"</strong> - Limpiar carrito</li>
                  <li><strong>"finalizar compra"</strong> - Procesar pedido</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ayuda para permisos */}
      {showHelp && (
        <div className="voice-modal-overlay" onClick={toggleHelp}>
          <div className="voice-modal help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>❓ Ayuda - Permisos del Micrófono</h4>
              <button className="btn-close" onClick={toggleHelp}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="help-content">
                <h5>🔧 Cómo habilitar el micrófono:</h5>
                <ol>
                  <li>
                    <strong>Chrome/Edge:</strong> Haz clic en el icono de candado 🔒 en la barra de direcciones
                  </li>
                  <li>
                    <strong>Selecciona:</strong> "Permisos del sitio" o "Configuración del sitio"
                  </li>
                  <li>
                    <strong>Micrófono:</strong> Cambia de "Bloqueado" a "Permitir"
                  </li>
                  <li>
                    <strong>Recarga:</strong> Actualiza la página y prueba de nuevo
                  </li>
                </ol>

                <div className="alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <strong>Nota:</strong> Firefox tiene soporte limitado. 
                  Usa Chrome o Edge para mejor experiencia.
                </div>

                <h5 className="mt-3">⌨️ Atajos de teclado:</h5>
                <ul>
                  <li><kbd>Alt+V</kbd> - Activar/Desactivar reconocimiento de voz</li>
                  <li><kbd>Alt+A</kbd> - Abrir asistente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper de error de red */}
      <NetworkErrorHelper 
        show={showNetworkError}
        onClose={() => setShowNetworkError(false)}
      />
    </>
  );
};
