import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para el asistente de voz
 * Proporciona funcionalidades de reconocimiento de voz y síntesis de voz
 * Basado en el sistema implementado en login.html
 */
export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Voz lista');
  const [selectedVoice, setSelectedVoice] = useState('predeterminada');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const shouldRestartRef = useRef(false); // Controla si debe reiniciarse automáticamente
  const restartTimeoutRef = useRef(null); // Para gestionar el timeout de reinicio

  // Inicializar voces disponibles
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('El navegador no soporta reconocimiento de voz');
      setVoiceStatus('Reconocimiento de voz no disponible');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;  // Mantener escuchando continuamente
    recognition.interimResults = true;  // Cambiar a true para mantener la conexión activa
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Escuchando...');
      console.log('✅ Reconocimiento iniciado correctamente');
    };

    recognition.onend = () => {
      console.log('🔴 Reconocimiento finalizado');
      
      // Solo reiniciar si el usuario NO lo detuvo manualmente
      // Y si la página está visible (no minimizada)
      if (shouldRestartRef.current && !document.hidden) {
        console.log('🔄 Manteniendo reconocimiento activo...');
        
        // Limpiar timeout previo si existe
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        
        // Reiniciar inmediatamente para mantener escucha continua
        restartTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && shouldRestartRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
              setVoiceStatus('Escuchando...');
              console.log('✅ Escucha continua mantenida');
            } catch (e) {
              // Si ya está corriendo, no es un problema
              if (e.message && e.message.includes('already started')) {
                console.log('ℹ️ Reconocimiento ya estaba activo');
                setIsListening(true);
                setVoiceStatus('Escuchando...');
              } else {
                console.error('⚠️ Error al mantener escucha:', e.message);
                setIsListening(false);
                setVoiceStatus('Error al mantener reconocimiento');
                shouldRestartRef.current = false;
              }
            }
          }
        }, 100); // Delay mínimo de 100ms
      } else {
        // Usuario detuvo manualmente
        setIsListening(false);
        setVoiceStatus('Voz lista');
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Error en reconocimiento de voz:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Error en reconocimiento';
      let shouldRetry = false;
      
      switch(event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Permiso de micrófono denegado. Ve a la configuración del navegador y permite el acceso al micrófono.';
          break;
        case 'no-speech':
          // No es un error grave, solo significa que no hablaste
          console.log('ℹ️ No se detectó voz - esto es normal');
          errorMessage = 'Esperando que hables...';
          shouldRetry = true;
          break;
        case 'audio-capture':
          errorMessage = 'No se encontró micrófono. Verifica que tu micrófono esté conectado.';
          break;
        case 'network':
          errorMessage = 'Error de red. Verifica tu conexión a internet o intenta en modo incógnito.';
          console.error('🌐 Error de red - posibles causas:');
          console.error('   1. Sin conexión a internet');
          console.error('   2. Firewall bloqueando Google Speech API');
          console.error('   3. Extensiones del navegador bloqueando la conexión');
          console.error('   4. Problema con servicios de Google');
          console.error('💡 Solución: Intenta abrir el navegador en modo incógnito');
          shouldRetry = false;
          // Desactivar auto-reinicio si hay error de red
          shouldRestartRef.current = false;
          break;
        case 'aborted':
          // Usuario detuvo manualmente, no es un error
          console.log('ℹ️ Reconocimiento detenido por el usuario');
          shouldRestartRef.current = false;
          return;
        case 'service-not-allowed':
          errorMessage = 'Servicio de reconocimiento no permitido. Necesitas HTTPS o localhost.';
          shouldRestartRef.current = false;
          break;
        default:
          errorMessage = `Error desconocido: ${event.error}`;
      }
      
      setVoiceStatus(errorMessage);
      
      // Mostrar error en consola con más detalles
      console.error('📊 Detalles del error de voz:', {
        error: event.error,
        message: event.message,
        timestamp: new Date().toISOString(),
        shouldRetry: shouldRetry
      });
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const text = result[0].transcript.toLowerCase().trim();
        setTranscript(text);
        addChatMessage('user', text);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      // Cleanup cuando el componente se desmonta
      shouldRestartRef.current = false;
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Función para hablar texto
  const speak = useCallback((text) => {
    if (!isVoiceEnabled || !text) return;

    // Cancelar cualquier síntesis en curso
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = voiceSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Seleccionar voz según preferencia
    const voices = synthRef.current.getVoices();
    let selectedVoiceObj = null;

    if (selectedVoice === 'femenina') {
      selectedVoiceObj = voices.find(voice => 
        voice.name.includes('Monica') || 
        voice.name.includes('Helena') || 
        voice.name.includes('Zira')
      );
    } else if (selectedVoice === 'masculina') {
      selectedVoiceObj = voices.find(voice => 
        voice.name.includes('Diego') || 
        voice.name.includes('Jorge')
      );
    }

    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj;
    }

    synthRef.current.speak(utterance);
    addChatMessage('assistant', text);
  }, [isVoiceEnabled, voiceSpeed, selectedVoice]);

  // Iniciar reconocimiento de voz
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('Reconocimiento de voz no inicializado');
      setVoiceStatus('Reconocimiento de voz no disponible en este navegador');
      return;
    }

    if (isListening) {
      console.log('Ya está escuchando');
      return;
    }

    // Activar flag de reinicio automático
    shouldRestartRef.current = true;

    try {
      // Detener cualquier instancia previa
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignorar error si no estaba corriendo
      }
      
      // Pequeño delay para asegurar que se detuvo
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          console.log('✅ Reconocimiento de voz iniciado correctamente');
          console.log('🔄 Auto-reinicio activado');
        } catch (error) {
          console.error('Error al iniciar reconocimiento (intento 2):', error);
          setVoiceStatus(`Error al iniciar: ${error.message}`);
          shouldRestartRef.current = false;
        }
      }, 100);
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      setVoiceStatus(`Error al iniciar reconocimiento: ${error.message}`);
      shouldRestartRef.current = false;
    }
  }, [isListening]);

  // Detener reconocimiento de voz
  const stopListening = useCallback(() => {
    // Desactivar flag de reinicio automático
    shouldRestartRef.current = false;
    
    // Limpiar timeout de reinicio si existe
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      console.log('🛑 Reconocimiento detenido por el usuario');
      console.log('🔄 Auto-reinicio desactivado');
    }
  }, [isListening]);

  // Alternar reconocimiento de voz
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Agregar mensaje al chat
  const addChatMessage = useCallback((sender, message) => {
    setChatMessages(prev => [...prev, { sender, message, timestamp: new Date() }]);
  }, []);

  // Limpiar chat
  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Limpiar transcripción
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    // Estados
    isListening,
    transcript,
    voiceStatus,
    selectedVoice,
    voiceSpeed,
    isVoiceEnabled,
    availableVoices,
    chatMessages,
    
    // Funciones
    speak,
    startListening,
    stopListening,
    toggleListening,
    setSelectedVoice,
    setVoiceSpeed,
    setIsVoiceEnabled,
    clearTranscript,
    clearChat,
    addChatMessage,
  };
};
