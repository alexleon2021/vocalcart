import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para el asistente de voz
 * Proporciona funcionalidades de reconocimiento de voz y síntesis de voz
 * Basado en el sistema implementado en login.html
 */
export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Presiona ESPACIO para hablar');
  const [selectedVoice, setSelectedVoice] = useState('predeterminada');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Referencias para Vosk WebSocket (reconocimiento offline)
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const isPushToTalkActiveRef = useRef(false);
  
  // Referencia para Web Speech API (síntesis)
  const synthRef = useRef(window.speechSynthesis);

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

  // Conectar WebSocket para reconocimiento offline con Vosk
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8000/ws/voice/');

        wsRef.current.onopen = () => {
          console.log('✅ WebSocket conectado - Reconocimiento offline (Vosk) listo');
          setVoiceStatus('Presiona ESPACIO para hablar');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          switch(data.type) {
            case 'ready':
              console.log('🎤 Vosk listo:', data.message);
              break;
            
            case 'partial':
              console.log('� Parcial:', data.transcript);
              setTranscript(data.transcript);
              break;
            
            case 'result':
            case 'final':
              console.log('✅ Final:', data.transcript);
              // Esperar un momento antes de actualizar el transcript para que termine el reconocimiento
              setTimeout(() => {
                setTranscript(data.transcript);
                addChatMessage('user', data.transcript);
              }, 200); // Pequeño delay para asegurar que el reconocimiento terminó
              break;
            
            case 'error':
              console.error('❌ Error Vosk:', data.message);
              setVoiceStatus(`Error: ${data.message}`);
              break;
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('❌ Error WebSocket:', error);
          setVoiceStatus('Error de conexión con el servidor');
        };

        wsRef.current.onclose = () => {
          console.log('🔌 WebSocket desconectado');
          setVoiceStatus('Reconexión...');
          setTimeout(connectWebSocket, 3000);
        };

      } catch (error) {
        console.error('❌ Error al conectar WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Función para hablar texto
  const speak = useCallback((text) => {
    if (!isVoiceEnabled || !text) return;

    try {
      // Cancelar cualquier síntesis en curso
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = voiceSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Seleccionar voz según preferencia
      const voices = synthRef.current.getVoices();
      console.log('🔊 Voces disponibles:', voices.length);
      
      let selectedVoiceObj = null;

      if (voices.length > 0) {
        // Intentar encontrar voz en español
        selectedVoiceObj = voices.find(voice => 
          voice.lang.startsWith('es')
        );

        // Si no hay voz en español, usar la primera disponible
        if (!selectedVoiceObj) {
          selectedVoiceObj = voices[0];
        }

        if (selectedVoice === 'femenina') {
          const femaleVoice = voices.find(voice => 
            voice.name.includes('Monica') || 
            voice.name.includes('Helena') || 
            voice.name.includes('Zira') ||
            voice.name.toLowerCase().includes('female')
          );
          if (femaleVoice) selectedVoiceObj = femaleVoice;
        } else if (selectedVoice === 'masculina') {
          const maleVoice = voices.find(voice => 
            voice.name.includes('Diego') || 
            voice.name.includes('Jorge') ||
            voice.name.toLowerCase().includes('male')
          );
          if (maleVoice) selectedVoiceObj = maleVoice;
        }

        if (selectedVoiceObj) {
          utterance.voice = selectedVoiceObj;
          console.log('🎤 Usando voz:', selectedVoiceObj.name);
        }
      } else {
        console.warn('⚠️ No hay voces disponibles, síntesis podría no funcionar');
      }

      // Eventos para debugging
      utterance.onstart = () => console.log('▶️ Síntesis iniciada');
      utterance.onend = () => console.log('✅ Síntesis completada');
      utterance.onerror = (e) => console.error('❌ Error en síntesis:', e.error);

      synthRef.current.speak(utterance);
      addChatMessage('assistant', text);
    } catch (error) {
      console.error('❌ Error al sintetizar voz:', error);
    }
  }, [isVoiceEnabled, voiceSpeed, selectedVoice]);

  // Inicializar captura de audio del micrófono para Vosk
  const initAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (!isPushToTalkActiveRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        wsRef.current.send(pcmData.buffer);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      audioProcessorRef.current = processor;

      console.log('🎤 Audio capturado correctamente (16kHz mono)');
      return true;

    } catch (error) {
      console.error('❌ Error al capturar audio:', error);
      setVoiceStatus('Error: No se puede acceder al micrófono');
      return false;
    }
  };

  // Iniciar reconocimiento de voz (Push-to-Talk)
  const startListening = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket no conectado');
      setVoiceStatus('Error: Servidor no conectado');
      return;
    }

    if (isPushToTalkActiveRef.current) {
      console.log('Ya está escuchando');
      return;
    }

    isPushToTalkActiveRef.current = true;

    if (!audioContextRef.current) {
      const success = await initAudioCapture();
      if (!success) {
        isPushToTalkActiveRef.current = false;
        return;
      }
    }

    setIsListening(true);
    setVoiceStatus('🎤 Escuchando... (suelta ESPACIO para detener)');
    setTranscript('');

    wsRef.current.send(JSON.stringify({ type: 'start' }));
    console.log('✅ Push-to-Talk activado (Vosk offline)');
  }, []);

  // Detener reconocimiento de voz (Push-to-Talk)
  const stopListening = useCallback(() => {
    if (!isPushToTalkActiveRef.current) {
      return;
    }

    isPushToTalkActiveRef.current = false;
    
    // Esperar un momento antes de cambiar el estado para que el servidor termine de procesar
    setTimeout(() => {
      setIsListening(false);
      setVoiceStatus('Presiona ESPACIO para hablar');
    }, 300); // Pequeño delay para que termine el procesamiento

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop' }));
    }

    console.log('🛑 Push-to-Talk desactivado');
  }, []);

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

  // Event listeners para Push-to-Talk con barra espaciadora
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== 'Space') return;

      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'BUTTON' ||
        target.isContentEditable
      ) {
        return;
      }

      if (!isPushToTalkActiveRef.current) {
        e.preventDefault();
      }

      startListening();
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;

      const target = e.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'BUTTON' ||
        target.isContentEditable
      ) {
        return;
      }

      if (isPushToTalkActiveRef.current) {
        e.preventDefault();
      }

      stopListening();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startListening, stopListening]);

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
