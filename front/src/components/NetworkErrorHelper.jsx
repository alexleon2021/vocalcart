import { useState } from 'react';
import './NetworkErrorHelper.css';

/**
 * Componente de ayuda para errores de red en reconocimiento de voz
 */
export const NetworkErrorHelper = ({ show, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!show) return null;

  const handleOpenIncognito = () => {
    alert('Para abrir en modo incógnito:\n\n' +
          'Chrome/Edge: Ctrl+Shift+N\n' +
          'Firefox: Ctrl+Shift+P\n\n' +
          'Luego ve a: http://localhost:5173');
  };

  const handleCheckExtensions = () => {
    alert('Para desactivar extensiones temporalmente:\n\n' +
          '1. Abre chrome://extensions\n' +
          '2. Desactiva todas las extensiones\n' +
          '3. Recarga la página (F5)\n' +
          '4. Intenta de nuevo el reconocimiento de voz');
  };

  const handleCheckFirewall = () => {
    setShowDetails(true);
  };

  return (
    <div className="network-error-overlay">
      <div className="network-error-modal">
        <div className="network-error-header">
          <h3>🌐 Error de Red en Reconocimiento de Voz</h3>
          <button className="btn-close-network-error" onClick={onClose}>✕</button>
        </div>

        <div className="network-error-body">
          <div className="error-explanation">
            <p>
              El reconocimiento de voz de Edge/Chrome usa los <strong>servicios en la nube de Google</strong>.
              Este error significa que no se puede conectar con esos servicios.
            </p>
            <p style={{ marginTop: '10px', color: '#d9534f', fontWeight: 'bold' }}>
              ⚠️ Estás en Edge en modo incógnito y aún falla. Esto sugiere un problema de red/firewall más serio.
            </p>
          </div>

          <div className="solutions-section">
            <h4>✅ Soluciones para Edge:</h4>

            <div className="solution-card" style={{ borderLeftColor: '#d9534f' }}>
              <div className="solution-icon">🌐</div>
              <div className="solution-content">
                <h5>1. Verificar Conexión a Google (MUY IMPORTANTE)</h5>
                <p>El error persiste incluso en incógnito. Verifica que puedas acceder a Google.</p>
                <a 
                  href="https://www.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-solution"
                >
                  🔗 Abrir Google (debe cargar completamente)
                </a>
                <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
                  Si Google no carga o es muy lento → tienes problema de conectividad
                </p>
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-icon">�</div>
              <div className="solution-content">
                <h5>2. Configuración de Privacidad de Edge</h5>
                <p>Edge puede tener configuraciones de privacidad que bloquean la API.</p>
                <button className="btn-solution" onClick={() => {
                  alert('Pasos para Edge:\n\n' +
                        '1. Abre edge://settings/privacy\n' +
                        '2. Privacidad, búsqueda y servicios\n' +
                        '3. En "Servicios", activa:\n' +
                        '   - Sugerencias de búsqueda y sitios\n' +
                        '   - Usar un servicio web...\n\n' +
                        '4. Recarga la página (F5)');
                }}>
                  ⚙️ Ver configuración de privacidad
                </button>
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-icon">🛡️</div>
              <div className="solution-content">
                <h5>3. Windows Defender / Firewall</h5>
                <p>Windows Defender o el firewall pueden estar bloqueando la conexión.</p>
                <button className="btn-solution" onClick={() => {
                  alert('Windows Firewall:\n\n' +
                        '1. Panel de Control\n' +
                        '2. Firewall de Windows Defender\n' +
                        '3. Configuración avanzada\n' +
                        '4. Reglas de salida\n' +
                        '5. Verifica que EDGE tenga permitido puerto 443\n\n' +
                        'O temporalmente desactiva el firewall para probar');
                }}>
                  🛡️ Configurar firewall
                </button>
              </div>
            </div>

            <div className="solution-card">
              <div className="solution-icon">💻</div>
              <div className="solution-content">
                <h5>4. Proxy / VPN Corporativo</h5>
                <p>Si estás en una red corporativa o universitaria, puede haber restricciones.</p>
                <button className="btn-solution" onClick={() => {
                  alert('Verifica:\n\n' +
                        '1. ¿Estás en red corporativa/universitaria?\n' +
                        '2. ¿Tienes VPN activa?\n' +
                        '3. ¿Hay proxy configurado?\n\n' +
                        'Solución: Prueba desde tu red de casa\n' +
                        'o usando datos móviles (hotspot)');
                }}>
                  🏢 Info sobre redes corporativas
                </button>
              </div>
            </div>

            <div className="solution-card" style={{ borderLeftColor: '#28a745' }}>
              <div className="solution-icon">�</div>
              <div className="solution-content">
                <h5>5. Test de Conectividad en Consola</h5>
                <p>Abre la consola del navegador (F12) y ejecuta este comando:</p>
                <pre className="code-block" style={{ fontSize: '0.75rem' }}>
fetch('https://www.google.com/speech-api/v2/recognize')
  .then(r =&gt; console.log('✅ API accesible:', r.status))
  .catch(e =&gt; console.error('❌ Error:', e));
                </pre>
                <button className="btn-solution" onClick={() => {
                  // Ejecutar el test
                  fetch('https://www.google.com/speech-api/v2/recognize')
                    .then(r => {
                      alert('✅ CONEXIÓN OK\n\nCódigo: ' + r.status + '\n\nLa API de Google es accesible.\nEl problema puede ser de permisos del micrófono.');
                      console.log('✅ API de Google accesible:', r.status);
                    })
                    .catch(e => {
                      alert('❌ CONEXIÓN BLOQUEADA\n\n' + 
                            'No se puede acceder a la API de Google.\n\n' +
                            'Causas posibles:\n' +
                            '- Firewall bloqueando\n' +
                            '- Sin internet\n' +
                            '- Proxy/VPN interfiriendo\n\n' +
                            'Error: ' + e.message);
                      console.error('❌ Error accediendo a API:', e);
                    });
                }}>
                  🧪 Ejecutar test ahora
                </button>
              </div>
            </div>

            {showDetails && (
              <div className="firewall-details">
                <h5>🛡️ Configurar Firewall:</h5>
                <ol>
                  <li>Permite conexiones salientes a <code>*.google.com</code></li>
                  <li>Puerto 443 (HTTPS) debe estar abierto</li>
                  <li>Temporalmente desactiva el antivirus para probar</li>
                </ol>

                <h5>🐧 Linux - UFW:</h5>
                <pre className="code-block">
sudo ufw allow out to any port 443
                </pre>

                <h5>🪟 Windows:</h5>
                <ol>
                  <li>Panel de Control → Firewall de Windows</li>
                  <li>Configuración avanzada</li>
                  <li>Reglas de salida → Nueva regla</li>
                  <li>Puerto 443, TCP, Permitir</li>
                </ol>
              </div>
            )}
          </div>

          <div className="alternative-section">
            <h4>🎯 Alternativa Temporal:</h4>
            <p>
              Mientras solucionas el problema de red, puedes usar los controles manuales:
            </p>
            <ul>
              <li>✍️ Escribe en los campos de búsqueda y formularios</li>
              <li>🖱️ Usa el mouse para hacer clic en productos y botones</li>
              <li>⌨️ Navega con el teclado (Tab, Enter)</li>
            </ul>
          </div>

          <div className="technical-info">
            <button 
              className="btn-toggle-technical"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▼' : '▶'} Información técnica
            </button>
            
            {showDetails && (
              <div className="technical-details">
                <p><strong>API utilizada:</strong> Google Cloud Speech-to-Text API</p>
                <p><strong>Protocolo:</strong> HTTPS (puerto 443)</p>
                <p><strong>Dominio:</strong> *.google.com</p>
                <p><strong>Error típico:</strong> ERR_NETWORK_CHANGED o timeout</p>
                <p><strong>Navegadores compatibles:</strong> Chrome, Edge, Opera</p>
                <p>
                  <strong>Nota:</strong> El reconocimiento de voz requiere conexión a internet
                  porque el procesamiento se hace en servidores de Google, no localmente.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="network-error-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
