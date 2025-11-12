import json
import asyncio
import base64
from channels.generic.websocket import AsyncWebsocketConsumer
from vosk import Model, KaldiRecognizer
from django.conf import settings
import os

class VoiceRecognitionConsumer(AsyncWebsocketConsumer):
    """
    WebSocket Consumer para reconocimiento de voz offline con Vosk
    Recibe audio del frontend y devuelve transcripciones en tiempo real
    """
    
    async def connect(self):
        """Conexión WebSocket establecida"""
        await self.accept()
        
        # Inicializar modelo Vosk en un thread separado para no bloquear
        self.model_path = settings.VOSK_MODEL_PATH
        self.recognizer = None
        self.sample_rate = 16000  # Vosk requiere 16kHz
        
        # Verificar que el modelo existe
        if not os.path.exists(self.model_path):
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Modelo Vosk no encontrado en {self.model_path}'
            }))
            await self.close()
            return
        
        try:
            # Cargar modelo en thread separado para no bloquear
            await asyncio.get_event_loop().run_in_executor(
                None, self._init_recognizer
            )
            
            await self.send(text_data=json.dumps({
                'type': 'ready',
                'message': 'Reconocimiento de voz listo'
            }))
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error al cargar modelo Vosk: {str(e)}'
            }))
            await self.close()
    
    def _init_recognizer(self):
        """Inicializa el modelo y reconocedor de Vosk (ejecutado en thread separado)"""
        self.model = Model(self.model_path)
        self.recognizer = KaldiRecognizer(self.model, self.sample_rate)
        self.recognizer.SetWords(True)
    
    async def disconnect(self, close_code):
        """Desconexión WebSocket"""
        # Limpiar recursos
        if hasattr(self, 'recognizer') and self.recognizer:
            del self.recognizer
        if hasattr(self, 'model') and self.model:
            del self.model
    
    async def receive(self, text_data=None, bytes_data=None):
        """
        Recibe datos del cliente (audio o comandos)
        """
        try:
            if text_data:
                # Mensaje de control (JSON)
                data = json.loads(text_data)
                msg_type = data.get('type')
                
                if msg_type == 'start':
                    # Reiniciar reconocedor para nueva sesión
                    if self.recognizer:
                        await asyncio.get_event_loop().run_in_executor(
                            None, self.recognizer.Reset
                        )
                    await self.send(text_data=json.dumps({
                        'type': 'started',
                        'message': 'Reconocimiento iniciado'
                    }))
                
                elif msg_type == 'stop':
                    # Finalizar reconocimiento y obtener resultado final
                    if self.recognizer:
                        final_result = await asyncio.get_event_loop().run_in_executor(
                            None, self.recognizer.FinalResult
                        )
                        result_json = json.loads(final_result)
                        
                        if result_json.get('text'):
                            await self.send(text_data=json.dumps({
                                'type': 'final',
                                'transcript': result_json['text']
                            }))
                    
                    await self.send(text_data=json.dumps({
                        'type': 'stopped',
                        'message': 'Reconocimiento detenido'
                    }))
            
            elif bytes_data:
                # Datos de audio (bytes crudos)
                if not self.recognizer:
                    return
                
                # Procesar audio en thread separado
                result = await asyncio.get_event_loop().run_in_executor(
                    None, self._process_audio, bytes_data
                )
                
                if result:
                    result_json = json.loads(result)
                    
                    # Enviar resultado parcial si hay texto
                    if 'partial' in result_json and result_json['partial']:
                        await self.send(text_data=json.dumps({
                            'type': 'partial',
                            'transcript': result_json['partial']
                        }))
                    
                    # Enviar resultado final si está completo
                    elif 'text' in result_json and result_json['text']:
                        await self.send(text_data=json.dumps({
                            'type': 'result',
                            'transcript': result_json['text']
                        }))
        
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error procesando audio: {str(e)}'
            }))
    
    def _process_audio(self, audio_data):
        """
        Procesa chunk de audio con Vosk (ejecutado en thread separado)
        
        Args:
            audio_data: bytes de audio PCM 16-bit mono 16kHz
            
        Returns:
            JSON string con resultado parcial o completo
        """
        if self.recognizer.AcceptWaveform(audio_data):
            # Frase completa detectada
            return self.recognizer.Result()
        else:
            # Resultado parcial (palabra siendo pronunciada)
            return self.recognizer.PartialResult()
