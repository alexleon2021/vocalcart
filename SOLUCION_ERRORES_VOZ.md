# 🔧 Solución de Errores de Voz - VocalCart

## ✅ Mejoras Implementadas

### 1. **Hook useVoiceAssistant Mejorado**

**Problemas solucionados:**

✅ **Auto-reinicio del reconocimiento** - Ahora el reconocimiento se reinicia automáticamente si se detiene inesperadamente

✅ **Manejo mejorado de errores** - Mensajes de error más descriptivos:
- `not-allowed/permission-denied`: "Permiso de micrófono denegado. Ve a la configuración del navegador..."
- `audio-capture`: "No se encontró micrófono. Verifica que tu micrófono esté conectado."
- `network`: "Error de red en el reconocimiento de voz"
- `no-speech`: No se considera error (simplemente no hablaste)
- `aborted`: Usuario detuvo manualmente (no es error)

✅ **Función startListening robusta** - Ahora detiene instancias previas antes de iniciar nueva sesión

✅ **Logging detallado** - Console logs con timestamps para debugging

### 2. **Componente VoiceDiagnostics (NUEVO)**

Un panel de diagnóstico completo que verifica:

✅ **Soporte del navegador** - Detecta si el navegador soporta reconocimiento de voz
✅ **Reconocimiento de voz** - Verifica disponibilidad de SpeechRecognition API
✅ **Síntesis de voz** - Verifica disponibilidad de SpeechSynthesis API
✅ **Conexión HTTPS** - Verifica que estés en HTTPS o localhost
✅ **Permisos de micrófono** - Muestra estado actual (granted/denied/prompt)

**Botón para solicitar permisos** - Permite solicitar acceso al micrófono directamente

**Lista de errores detectados** - Muestra problemas específicos con soluciones

**Soluciones comunes** - Guía paso a paso para resolver problemas

---

## 🎯 Cómo Usar el Diagnóstico

1. **Abre la aplicación** en http://localhost:5173

2. **Haz clic en el botón "🔧 Diagnóstico"** (esquina inferior derecha)

3. **Revisa el estado de cada componente:**
   - ✅ = Todo bien
   - ❌ = Problema detectado
   - ⚠️ = Requiere atención
   - ❓ = Desconocido

4. **Si hay errores:**
   - Lee la lista de "Problemas detectados"
   - Sigue las instrucciones de "Soluciones comunes"
   - Haz clic en "🎤 Solicitar acceso al micrófono" si el permiso está pendiente

5. **Actualiza el diagnóstico** con el botón "🔄 Actualizar diagnóstico" después de hacer cambios

---

## 🚨 Errores Comunes y Soluciones

### ❌ Error: "Error al iniciar reconocimiento"

**Causas posibles:**

1. **El reconocimiento ya está corriendo**
   - Solución: El hook ahora detiene instancias previas automáticamente

2. **Permisos no concedidos**
   - Solución: Abre el diagnóstico y haz clic en "Solicitar acceso al micrófono"
   - O manualmente: Candado 🔒 en barra URL → Configuración del sitio → Micrófono → Permitir

3. **Navegador no compatible**
   - Solución: Usa Google Chrome, Microsoft Edge u Opera
   - Firefox y Safari tienen soporte limitado

### ❌ Error: "Permiso de micrófono denegado"

**Solución:**

1. **Chrome/Edge:**
   - Haz clic en el candado 🔒 junto a la URL
   - Configuración del sitio
   - Micrófono → Permitir
   - Recarga la página (F5)

2. **Linux (permisos del sistema):**
   ```bash
   # Verificar que el micrófono esté detectado
   arecord -l
   
   # Probar grabación
   arecord -d 5 test.wav
   aplay test.wav
   ```

3. **Usar el diagnóstico:**
   - Botón "🔧 Diagnóstico"
   - Clic en "🎤 Solicitar acceso al micrófono"
   - Permitir cuando el navegador pregunte

### ❌ Error: "No se encontró micrófono"

**Solución:**

1. **Verificar hardware:**
   - Asegúrate de que el micrófono esté conectado
   - Prueba en otra aplicación (grabadora de voz, Discord, etc.)

2. **Linux - Verificar PulseAudio/PipeWire:**
   ```bash
   # Ver dispositivos de audio
   pactl list sources
   
   # Verificar que el micrófono no esté en mute
   pactl set-source-mute @DEFAULT_SOURCE@ 0
   ```

3. **Configuración del navegador:**
   - Settings → Privacy and security → Site settings → Microphone
   - Selecciona el micrófono correcto

### ❌ Error: "Error de red en el reconocimiento de voz"

**Causas:**

El reconocimiento de voz de Chrome usa servicios de Google en la nube.

**Solución:**

1. **Verificar conexión a internet:**
   ```bash
   ping google.com
   ```

2. **Verificar firewall/proxy:**
   - Asegúrate de que no esté bloqueando conexiones a Google

3. **Probar en modo incógnito:**
   - Abre el navegador en modo incógnito
   - Ve a http://localhost:5173
   - Prueba el reconocimiento

### ❌ Error: "Reconocimiento de voz no disponible en este navegador"

**Solución:**

Navegadores compatibles:
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge (recomendado)
- ✅ Opera
- ⚠️ Firefox (soporte experimental)
- ❌ Safari (no soportado completamente)

**Cambiar a Chrome:**
```bash
# Instalar Chrome en Ubuntu/Debian
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

---

## 🔍 Debugging Paso a Paso

### 1. Abrir Consola del Navegador

**Chrome/Edge:** `F12` o `Ctrl+Shift+I`

### 2. Ver Errores de Voz

En la consola busca mensajes como:
```
Error en reconocimiento de voz: not-allowed
Detalles del error de voz: {...}
```

### 3. Verificar Instancias del Reconocimiento

```javascript
// En la consola del navegador
console.log('SpeechRecognition:', window.SpeechRecognition || window.webkitSpeechRecognition);
```

Debe devolver una función. Si es `undefined`, el navegador no lo soporta.

### 4. Probar Manualmente

```javascript
// En la consola del navegador
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.onresult = (e) => console.log('Resultado:', e.results[0][0].transcript);
recognition.onerror = (e) => console.error('Error:', e.error);
recognition.start();
// Ahora habla algo
```

---

## 📋 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Navegador compatible (Chrome/Edge)
- [ ] HTTPS o localhost (no HTTP normal)
- [ ] Permisos de micrófono concedidos
- [ ] Micrófono conectado y funcionando
- [ ] Conexión a internet activa
- [ ] Sin extensiones que bloqueen el micrófono
- [ ] Consola del navegador sin errores de JavaScript

---

## 🛠️ Herramientas de Diagnóstico

### En la Aplicación:

1. **Botón "🔧 Diagnóstico"** - Panel completo de verificación
2. **Panel de Voz** - Muestra estado actual ("Escuchando...", "Voz lista", errores)
3. **Console.log** - Mensajes detallados en la consola del navegador

### Comandos de Terminal:

```bash
# Verificar servidores corriendo
ps aux | grep -E "runserver|vite"

# Backend Django
curl http://localhost:8000/api/categoria/

# Frontend React
curl http://localhost:5173

# Verificar micrófono en Linux
arecord -l
```

---

## 🎤 Flujo de Activación Correcto

1. Página carga → Hook se inicializa
2. Usuario hace clic en "Activar Voz"
3. Navegador solicita permiso (si no lo tiene)
4. Usuario permite acceso
5. `recognition.start()` se ejecuta
6. Estado cambia a "Escuchando..."
7. Usuario habla
8. Evento `onresult` captura texto
9. Comando se procesa
10. Confirmación por voz

---

## 📞 Si Nada Funciona

1. **Abre el diagnóstico** (botón "🔧 Diagnóstico")
2. **Captura de pantalla** del panel de diagnóstico
3. **Copia los errores** de la consola del navegador (F12)
4. **Información del sistema:**
   ```bash
   # Linux
   uname -a
   google-chrome --version
   
   # Navegador
   # En consola: navigator.userAgent
   ```

---

## ✅ Estado Actual

**Mejoras implementadas:**
- ✅ Auto-reinicio del reconocimiento
- ✅ Manejo robusto de errores
- ✅ Panel de diagnóstico completo
- ✅ Solicitud directa de permisos
- ✅ Mensajes de error descriptivos
- ✅ Logging detallado para debugging

**Próximos pasos:**
1. Abre http://localhost:5173
2. Haz clic en "🔧 Diagnóstico"
3. Revisa el estado
4. Sigue las instrucciones del panel

---

**La aplicación ahora tiene herramientas completas para diagnosticar y resolver problemas de voz. El botón "🔧 Diagnóstico" te guiará paso a paso.** 🎙️✅
