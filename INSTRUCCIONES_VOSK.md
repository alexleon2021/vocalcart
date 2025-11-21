# 🎤 Sistema de Reconocimiento de Voz Offline con Vosk

## ✅ Sistema Implementado

Se ha implementado un sistema de reconocimiento de voz **100% OFFLINE** usando:
- **Backend:** Django + Vosk + WebSocket (Channels)
- **Frontend:** React + WebSocket
- **Modelo:** Vosk Small Spanish (39MB descargado)

---

## 🚀 Cómo Usar

### 1. Iniciar Django con WebSocket (Terminal 1)

```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart
source ../envvocalcart/bin/activate
daphne -p 8000 vocalcart.asgi:application
```

### 2. Iniciar React (Terminal 2)

```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart/front
npm run dev
```

### 3. Probar el Sistema

1. Abre Chrome/Chromium en: `http://localhost:5173`
2. Presiona y **mantén** la **BARRA ESPACIADORA**
3. Habla algo en español
4. Suelta la barra espaciadora
5. Verás el texto transcrito en pantalla

---

## 🔧 Cambios Realizados

### Backend (Django)

1. **Instalado:**
   - `vosk` - Motor de reconocimiento offline
   - `channels` - Soporte WebSocket
   - `daphne` - Servidor ASGI
   - Modelo: `vosk-model-small-es-0.42` (39MB)

2. **Archivos Modificados:**
   - `settings.py` - Agregado Channels, Daphne, configuración ASGI
   - `asgi.py` - Configurado routing WebSocket
   
3. **Archivos Creados:**
   - `gestion_asistente/consumers.py` - Procesa audio con Vosk
   - `gestion_asistente/routing.py` - Rutas WebSocket

### Frontend (React)

1. **Archivo Creado:**
   - `hooks/useVoiceAssistantVosk.js` - Hook con WebSocket

---

## 📋 Para Cambiar al Sistema Vosk (Opcional)

Si quieres usar el reconocimiento offline en lugar de Google:

### Opción A: Reemplazar el hook actual

```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart/front/src/hooks
mv useVoiceAssistant.js useVoiceAssistantGoogle.js.backup
mv useVoiceAssistantVosk.js useVoiceAssistant.js
```

### Opción B: Importar el nuevo hook manualmente

En `Shop.jsx` y otros componentes, cambia la importación:

```javascript
// Antes (Google - requiere internet)
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

// Ahora (Vosk - offline)
import { useVoiceAssistant } from '../hooks/useVoiceAssistantVosk';
```

---

## 🧪 Verificar que Funciona

1. **Django corriendo con Daphne:**
   ```
   Debe mostrar: "Starting server at tcp:port=8000:interface=..."
   ```

2. **Abrir consola del navegador (F12):**
   ```
   Debes ver: "✅ WebSocket conectado - Reconocimiento offline listo"
   Debes ver: "🎤 Vosk listo: Reconocimiento de voz listo"
   ```

3. **Al presionar ESPACIO:**
   ```
   Debes ver: "✅ Push-to-Talk activado"
   Debes ver: "🎤 Audio capturado correctamente (16kHz mono)"
   ```

4. **Al hablar:**
   ```
   Debes ver transcripciones parciales y finales en consola
   ```

---

## ⚠️ Solución de Problemas

### Error: "Modelo Vosk no encontrado"
```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart
ls vosk-model-small-es-0.42/
# Debe mostrar archivos como: am/, conf/, graph/, etc.
```

### Error: "WebSocket no conectado"
- Verifica que Django esté corriendo con **daphne** (no con `python manage.py runserver`)
- Puerto debe ser 8000

### Error: "No se puede acceder al micrófono"
- Chromium debe pedir permiso para usar micrófono
- Verifica permisos en: `chrome://settings/content/microphone`

---

## 💡 Ventajas del Sistema Vosk

✅ Funciona **sin internet** (100% offline)
✅ Privacidad total (audio no sale de tu computadora)
✅ Baja latencia
✅ No depende de servicios externos
✅ Gratis e ilimitado

---

## 📊 Comparación

| Característica | Web Speech API (Google) | Vosk (Offline) |
|----------------|------------------------|----------------|
| Internet | ✅ Requiere | ❌ No requiere |
| Privacidad | ❌ Envía audio a Google | ✅ Todo local |
| Latencia | Media | Baja |
| Precisión | Muy alta | Alta |
| Costo | Gratis (límites) | Gratis (ilimitado) |

---

## 🔄 Volver a Google Speech API

Si quieres volver al sistema anterior:

```bash
cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart/front/src/hooks
mv useVoiceAssistant.js useVoiceAssistantVosk.js
mv useVoiceAssistantGoogle.js.backup useVoiceAssistant.js
```

Y usar: `python manage.py runserver` en lugar de `daphne`

