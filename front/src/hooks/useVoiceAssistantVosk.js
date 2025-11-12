import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para el asistente de voz con Vosk (offline)
 * Usa WebSocket para comunicarse con Django + Vosk en el backend
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

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const isPushToTalkActiveRef = useRef(false);

  // Inicializar voces disponibles para síntesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices();
    }
  }, []);

  // Conectar WebSocket cuando el componente se monta
  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      // Conectar a Django WebSocket (puerto 8000)
      wsRef.current = new WebSocket('ws://localhost:8000/ws/voice/');

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket conectado - Reconocimiento offline listo');
        setVoiceStatus('Presiona ESPACIO para hablar');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'ready':
            console.log('🎤 Vosk listo:', data.message);
            break;
          
          case 'partial':
            // Transcripción parcial (mientras hablas)
            console.log('📝 Parcial:', data.transcript);
            setTranscript(data.transcript);
            break;
          
          case 'result':
          case 'final':
            // Transcripción final
            console.log('✅ Final:', data.transcript);
            setTranscript(data.transcript);
            addChatMessage('user', data.transcript);
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
        // Reintentar conexión después de 3 segundos
        setTimeout(connectWebSocket, 3000);
      };

    } catch (error) {
      console.error('❌ Error al conectar WebSocket:', error);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Inicializar captura de audio del micrófono
  const initAudioCapture = async () => {
    try {
      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,  // Mono
          sampleRate: 16000,  // Vosk requiere 16kHz
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      mediaStreamRef.current = stream;

      // Crear AudioContext para procesar audio
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Crear ScriptProcessor para capturar audio en chunks
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (!isPushToTalkActiveRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        // Obtener datos de audio
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convertir Float32Array a Int16Array (PCM 16-bit)
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Enviar audio al WebSocket como bytes
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

  // Función para hablar texto (síntesis)
  const speak = useCallback((text) => {
    if (!isVoiceEnabled || !text) return;

    try {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = voiceSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = synthRef.current.getVoices();
      console.log('🔊 Voces disponibles:', voices.length);
      
      let selectedVoiceObj = null;

      if (voices.length > 0) {
        selectedVoiceObj = voices.find(voice => voice.lang.startsWith('es'));
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
        console.warn('⚠️ No hay voces disponibles');
      }

      utterance.onstart = () => console.log('▶️ Síntesis iniciada');
      utterance.onend = () => console.log('✅ Síntesis completada');
      utterance.onerror = (e) => console.error('❌ Error en síntesis:', e.error);

      synthRef.current.speak(utterance);
      addChatMessage('assistant', text);
    } catch (error) {
      console.error('❌ Error al sintetizar voz:', error);
    }
  }, [isVoiceEnabled, voiceSpeed, selectedVoice]);

  // Iniciar escucha (Push-to-Talk)
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

    // Inicializar audio si no está inicializado
    if (!audioContextRef.current) {
      const success = await initAudioCapture();
      if (!success) {
        isPushToTalkActiveRef.current = false;
        return;
      }
    }

    setIsListening(true);
    setVoiceStatus('🎤 Escuchando... (suelta ESPACIO para detener)');
    setTranscript('');  // Limpiar transcript anterior

    // Notificar al servidor que inicia el reconocimiento
    wsRef.current.send(JSON.stringify({ type: 'start' }));
    console.log('✅ Push-to-Talk activado');

  }, []);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (!isPushToTalkActiveRef.current) {
      return;
    }

    isPushToTalkActiveRef.current = false;
    setIsListening(false);
    setVoiceStatus('Presiona ESPACIO para hablar');

    // Notificar al servidor que detiene el reconocimiento
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop' }));
    }

    console.log('🛑 Push-to-Talk desactivado');
  }, []);

  // Agregar mensaje al chat
  const addChatMessage = useCallback((sender, message) => {
    setChatMessages(prev => [...prev, { sender, message, timestamp: new Date() }]);
  }, []);

  // Manejo de teclas para Push-to-Talk
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo activar con barra espaciadora
      if (e.code !== 'Space') return;

      // Ignorar si está en un input, textarea, select, button o elemento editable
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

      // Prevenir comportamiento por defecto del espacio (scroll)
      e.preventDefault();
      e.stopPropagation();

      // Iniciar reconocimiento
      startListening();
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;

      // Prevenir comportamiento por defecto
      e.preventDefault();
      e.stopPropagation();

      // Detener reconocimiento
      stopListening();
    };

    // Agregar listeners con capture para interceptar eventos antes
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [startListening, stopListening]);

  return {
    isListening,
    transcript,
    voiceStatus,
    speak,
    startListening,
    stopListening,
    selectedVoice,
    setSelectedVoice,
    voiceSpeed,
    setVoiceSpeed,
    isVoiceEnabled,
    setIsVoiceEnabled,
    availableVoices,
    chatMessages,
  };
};
