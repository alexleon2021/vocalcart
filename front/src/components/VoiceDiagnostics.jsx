import { useState, useEffect } from 'react';
import './VoiceDiagnostics.css';

/**
 * Componente de diagnóstico de voz
 * Ayuda a identificar problemas con el reconocimiento de voz
 */
export const VoiceDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    browserSupport: false,
    microphonePermission: 'unknown',
    speechRecognitionAvailable: false,
    speechSynthesisAvailable: false,
    httpsConnection: false,
    errors: [],
  });

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      errors: [],
    };

    // 1. Verificar soporte del navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    results.speechRecognitionAvailable = !!SpeechRecognition;
    results.browserSupport = !!SpeechRecognition;

    if (!SpeechRecognition) {
      results.errors.push('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge u Opera.');
    }

    // 2. Verificar síntesis de voz
    results.speechSynthesisAvailable = 'speechSynthesis' in window;
    if (!results.speechSynthesisAvailable) {
      results.errors.push('Tu navegador no soporta síntesis de voz.');
    }

    // 3. Verificar conexión HTTPS o localhost
    results.httpsConnection = window.location.protocol === 'https:' || 
                              window.location.hostname === 'localhost' ||
                              window.location.hostname === '127.0.0.1';
    
    if (!results.httpsConnection) {
      results.errors.push('El reconocimiento de voz requiere HTTPS o localhost.');
    }

    // 4. Verificar permisos de micrófono
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        results.microphonePermission = permission.state; // 'granted', 'denied', 'prompt'
        
        if (permission.state === 'denied') {
          results.errors.push('Los permisos del micrófono están denegados. Ve a la configuración del navegador.');
        }

        // Escuchar cambios en permisos
        permission.onchange = () => {
          setDiagnostics(prev => ({
            ...prev,
            microphonePermission: permission.state
          }));
        };
      }
    } catch (error) {
      console.log('No se pudo verificar permisos:', error);
      results.microphonePermission = 'unknown';
    }

    setDiagnostics(results);
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Detener el stream inmediatamente
      stream.getTracks().forEach(track => track.stop());
      
      setDiagnostics(prev => ({
        ...prev,
        microphonePermission: 'granted',
        errors: prev.errors.filter(e => !e.includes('micrófono'))
      }));
      
      alert('✅ Permiso de micrófono concedido. Ahora puedes usar el reconocimiento de voz.');
    } catch (error) {
      console.error('Error al solicitar acceso al micrófono:', error);
      setDiagnostics(prev => ({
        ...prev,
        microphonePermission: 'denied',
        errors: [...prev.errors, `Error al acceder al micrófono: ${error.message}`]
      }));
      
      alert('❌ No se pudo acceder al micrófono. Verifica la configuración de tu navegador.');
    }
  };

  const getStatusIcon = (status) => {
    if (status === true || status === 'granted') return '✅';
    if (status === false || status === 'denied') return '❌';
    if (status === 'prompt') return '⚠️';
    return '❓';
  };

  if (!showDiagnostics) {
    return (
      <button
        className="btn-show-diagnostics"
        onClick={() => setShowDiagnostics(true)}
        title="Mostrar diagnóstico de voz"
      >
        🔧 Diagnóstico
      </button>
    );
  }

  return (
    <div className="diagnostics-modal">
      <div className="diagnostics-content">
        <div className="diagnostics-header">
          <h3>🔧 Diagnóstico de Voz</h3>
          <button 
            className="btn-close-diagnostics"
            onClick={() => setShowDiagnostics(false)}
          >
            ✕
          </button>
        </div>

        <div className="diagnostics-body">
          <div className="diagnostic-item">
            <span className="diagnostic-icon">{getStatusIcon(diagnostics.browserSupport)}</span>
            <div className="diagnostic-info">
              <strong>Soporte del navegador:</strong>
              <p>{diagnostics.browserSupport ? 'Compatible' : 'No compatible - usa Chrome, Edge u Opera'}</p>
            </div>
          </div>

          <div className="diagnostic-item">
            <span className="diagnostic-icon">{getStatusIcon(diagnostics.speechRecognitionAvailable)}</span>
            <div className="diagnostic-info">
              <strong>Reconocimiento de voz:</strong>
              <p>{diagnostics.speechRecognitionAvailable ? 'Disponible' : 'No disponible'}</p>
            </div>
          </div>

          <div className="diagnostic-item">
            <span className="diagnostic-icon">{getStatusIcon(diagnostics.speechSynthesisAvailable)}</span>
            <div className="diagnostic-info">
              <strong>Síntesis de voz:</strong>
              <p>{diagnostics.speechSynthesisAvailable ? 'Disponible' : 'No disponible'}</p>
            </div>
          </div>

          <div className="diagnostic-item">
            <span className="diagnostic-icon">{getStatusIcon(diagnostics.httpsConnection)}</span>
            <div className="diagnostic-info">
              <strong>Conexión segura:</strong>
              <p>{diagnostics.httpsConnection ? 'HTTPS o localhost' : 'Se requiere HTTPS'}</p>
            </div>
          </div>

          <div className="diagnostic-item">
            <span className="diagnostic-icon">{getStatusIcon(diagnostics.microphonePermission)}</span>
            <div className="diagnostic-info">
              <strong>Permiso de micrófono:</strong>
              <p>
                {diagnostics.microphonePermission === 'granted' && 'Concedido ✓'}
                {diagnostics.microphonePermission === 'denied' && 'Denegado - Cambia en configuración del navegador'}
                {diagnostics.microphonePermission === 'prompt' && 'Pendiente - Haz clic abajo para solicitar'}
                {diagnostics.microphonePermission === 'unknown' && 'Desconocido'}
              </p>
            </div>
          </div>

          {diagnostics.microphonePermission !== 'granted' && (
            <button 
              className="btn-request-microphone"
              onClick={requestMicrophoneAccess}
            >
              🎤 Solicitar acceso al micrófono
            </button>
          )}

          {diagnostics.errors.length > 0 && (
            <div className="diagnostics-errors">
              <h4>⚠️ Problemas detectados:</h4>
              <ul>
                {diagnostics.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {diagnostics.errors.length === 0 && diagnostics.microphonePermission === 'granted' && (
            <div className="diagnostics-success">
              <h4>✅ Todo está listo</h4>
              <p>Puedes usar el reconocimiento de voz sin problemas.</p>
              <p><strong>Haz clic en "Activar Voz"</strong> en el panel flotante para comenzar.</p>
            </div>
          )}

          <div className="diagnostics-help">
            <h4>💡 Soluciones comunes:</h4>
            <ul>
              <li><strong>Navegador no compatible:</strong> Usa Google Chrome, Microsoft Edge u Opera</li>
              <li><strong>Permiso denegado:</strong> Ve a Configuración del sitio (candado 🔒 en la barra de URL) → Micrófono → Permitir</li>
              <li><strong>Micrófono no detectado:</strong> Verifica que tu micrófono esté conectado y seleccionado como predeterminado</li>
              <li><strong>Error de red:</strong> Asegúrate de tener conexión a internet (el reconocimiento usa servicios de Google)</li>
            </ul>
          </div>

          <button 
            className="btn-refresh-diagnostics"
            onClick={runDiagnostics}
          >
            🔄 Actualizar diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
};
