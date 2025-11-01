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
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Escuchando...');
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceStatus('Voz lista');
    };

    recognition.onerror = (event) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Error en reconocimiento';
      
      switch(event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Permiso de micrófono denegado';
          break;
        case 'no-speech':
          errorMessage = 'No se detectó voz';
          break;
        case 'audio-capture':
          errorMessage = 'No se encontró micrófono';
          break;
        case 'network':
          errorMessage = 'Error de red';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      setVoiceStatus(errorMessage);
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
      return;
    }

    if (isListening) {
      console.log('Ya está escuchando');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      setVoiceStatus('Error al iniciar reconocimiento');
    }
  }, [isListening]);

  // Detener reconocimiento de voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
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
