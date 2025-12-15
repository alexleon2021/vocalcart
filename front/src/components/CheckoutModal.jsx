import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import './CheckoutModal.css';

/**
 * Modal de Checkout con flujo de facturación y envío
 * Totalmente accesible por voz
 */
export const CheckoutModal = ({ isOpen, onClose, cartItems, onCheckoutComplete }) => {
  const [step, setStep] = useState(1); // 1: Facturación, 2: Envío, 3: Confirmación
  const [requiereEnvio, setRequiereEnvio] = useState(true);
  const [currentField, setCurrentField] = useState('nombre_facturacion'); // Campo actual en modo paso a paso
  const [resumenLeido, setResumenLeido] = useState(false); // Controla si ya se leyó el resumen antes de confirmar
  const { speak, transcript, clearTranscript, isListening } = useVoiceAssistant();
  
  // Acumulador para números mientras el usuario está hablando
  const accumulatedNumbersRef = useRef('');
  const lastProcessedCommandRef = useRef('');
  const commandProcessedSuccessfullyRef = useRef(false);
  
  // Direcciones de tiendas para recogida en Guayaquil, Ecuador
  const tiendasDisponibles = [
    'Av. 9 de Octubre 100 y Malecón Simón Bolívar, Local 12, Guayaquil',
    'Av. Francisco de Orellana, Mall del Sol, Local 203, Guayaquil',
    'Av. Carlos Julio Arosemena Km 2.5, Riocentro Entre Ríos, Guayaquil',
    'Av. Benjamín Carrión y Av. Guillermo Pareja, San Marino Shopping, Guayaquil'
  ];
  
  const tiendaSeleccionada = tiendasDisponibles[Math.floor(Math.random() * tiendasDisponibles.length)];
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Facturación
    nombre_facturacion: '',
    documento_facturacion: '',
    telefono_facturacion: '',
    email_facturacion: '',
    
    // Datos de pago
    numero_tarjeta: '',
    cvv: '',
    fecha_expiracion: '',
    
    // Envío
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    notas_adicionales: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const iva = subtotal * 0.19; // IVA del 19%
  const total = subtotal + iva;

  // Resetear resumenLeido cuando cambia el paso
  useEffect(() => {
    if (step === 3) {
      setResumenLeido(false); // Resetear cuando se llega al paso 3
    }
  }, [step]);

  // Leer instrucciones al abrir el modal - MODO PASO A PASO
  useEffect(() => {
    if (!isOpen) return;
    
    // Resetear al primer campo cuando se abre el modal por primera vez
    if (step === 1 && !formData.nombre_facturacion) {
      setCurrentField('nombre_facturacion');
      
      // Mensaje inicial solo una vez
      setTimeout(() => {
        speak('Finalizar compra. Vamos a completar tus datos paso a paso. Indícame tu nombre completo. Di: mi nombre es, seguido de tu nombre.');
      }, 500);
    }
  }, [isOpen, step, formData.nombre_facturacion, speak]);
  
  // Función para pedir el siguiente campo
  const pedirSiguienteCampo = useCallback((campoActual) => {
    console.log('🎯 Pidiendo siguiente campo:', campoActual);
    
    const mensajes = {
      'documento_facturacion': 'Documento de identidad. Di: mi documento es, seguido de los números.',
      'telefono_facturacion': 'Teléfono. Di: mi teléfono es, seguido de los números.',
      'email_facturacion': 'Correo electrónico. Di: mi correo es, seguido de tu email. Puedes decir arroba.',
      'numero_tarjeta': 'Número de tarjeta. Di: mi tarjeta es, seguido de los 16 dígitos.',
      'cvv': 'Código de seguridad. Di: CVV, seguido de 3 o 4 dígitos.',
      'fecha_expiracion': 'Fecha de vencimiento. Di: vencimiento, mes y año. Ejemplo: vencimiento 12 25.',
      'completado_paso1': 'Datos completados. ¿Envío a domicilio o recogida en tienda? Di: con envío, o sin envío.',
      'direccion': 'Dirección. Di: mi dirección es, seguido de tu dirección completa.',
      'ciudad': 'Ciudad. Di: mi ciudad es, seguido del nombre.',
      'codigo_postal': 'Código postal. Di: código postal, seguido de los números.',
      'completado_envio': 'Datos de envío completados. Di siguiente para revisar.'
    };
    
    const mensaje = mensajes[campoActual];
    console.log('📢 Mensaje a decir:', mensaje);
    
    if (mensaje) {
      setTimeout(() => {
        console.log('🔊 Ejecutando speak');
        speak(mensaje);
      }, 400);
    }
  }, [speak]);

  // Función para convertir números en palabras a dígitos
  const convertirNumerosADigitos = (texto) => {
    // Diccionario de números en español
    const numeros = {
      'cero': '0', 'uno': '1', 'una': '1', 'un': '1',
      'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5',
      'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9',
      'diez': '10', 'once': '11', 'doce': '12', 'trece': '13',
      'catorce': '14', 'quince': '15', 'dieciséis': '16', 'dieciseis': '16',
      'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19',
      'veinte': '20', 'veintiuno': '21', 'veintidós': '22', 'veintidos': '22',
      'veintitrés': '23', 'veintitres': '23', 'veinticuatro': '24',
      'veinticinco': '25', 'veintiséis': '26', 'veintiseis': '26',
      'veintisiete': '27', 'veintiocho': '28', 'veintinueve': '29',
      'treinta': '30', 'cuarenta': '40', 'cincuenta': '50',
      'sesenta': '60', 'setenta': '70', 'ochenta': '80', 'noventa': '90'
    };

    let resultado = texto.toLowerCase();
    console.log('🔤 Texto original:', resultado);

    // Convertir cada número en palabra a dígito
    Object.entries(numeros).forEach(([palabra, digito]) => {
      const regex = new RegExp(`\\b${palabra}\\b`, 'g');
      resultado = resultado.replace(regex, digito);
    });

    // Manejar números compuestos como "treinta y cinco" -> "35"
    resultado = resultado.replace(/(\d+)\s+y\s+(\d+)/g, (match, decena, unidad) => {
      return String(parseInt(decena) + parseInt(unidad));
    });

    // Eliminar espacios entre dígitos para formar números completos
    // Ej: "1 2 3 4" -> "1234"
    resultado = resultado.replace(/(\d)\s+(\d)/g, '$1$2');

    console.log('🔢 Texto convertido:', resultado);
    return resultado;
  };

  // Procesar comandos de voz
  useEffect(() => {
    if (!transcript || !isOpen) return;
    
    const cmd = transcript.toLowerCase().trim();
    
    // Si está escuchando, solo acumular números (no procesar aún)
    if (isListening) {
      // Detectar si son solo números o números en palabras (para documentos, teléfonos, etc.)
      const numerosEnTexto = convertirNumerosADigitos(cmd);
      const soloNumeros = numerosEnTexto.replace(/\s/g, '').replace(/\D/g, '');
      
      // Si el campo actual es documento/teléfono/tarjeta y solo hay números, acumular
      const esCampoNumerico = currentField === 'documento_facturacion' || 
                              currentField === 'telefono_facturacion' || 
                              currentField === 'numero_tarjeta' ||
                              currentField === 'cvv' ||
                              currentField === 'codigo_postal';
      
      if (esCampoNumerico && soloNumeros.length > 0 && 
          !cmd.includes('mi documento es') && 
          !cmd.includes('mi teléfono es') && 
          !cmd.includes('mi tarjeta es') &&
          !cmd.includes('cvv') &&
          !cmd.includes('vencimiento') &&
          !cmd.includes('código postal')) {
        // Acumular números mientras el usuario está hablando
        accumulatedNumbersRef.current = soloNumeros;
        console.log('📝 Acumulando números mientras hablas:', accumulatedNumbersRef.current);
        return; // No procesar aún, esperar a que termine de hablar
      }
      
      // Si no es un campo numérico o no son solo números, no hacer nada mientras escucha
      return;
    }
    
    // Cuando termine de escuchar, procesar el comando
    // Esperar un momento después de que termine el reconocimiento antes de procesar
    // Esto evita que el bot hable mientras el usuario todavía está hablando
    const timer = setTimeout(() => {
      // Solo procesar si no está escuchando
      if (!isListening) {
        processVoiceCommand(transcript);
      }
    }, 500); // Esperar 500ms después de que termine el reconocimiento
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isOpen, isListening, currentField]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === 'numero_tarjeta') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.substring(0, 19); // 16 dígitos + 3 espacios
    }
    
    // Formatear fecha de expiración (MM/AA)
    if (name === 'fecha_expiracion') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      formattedValue = formattedValue.substring(0, 5);
    }
    
    // Formatear CVV (solo números)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFacturacion = () => {
    const newErrors = {};
    
    if (!formData.nombre_facturacion.trim()) {
      newErrors.nombre_facturacion = 'El nombre es requerido';
    }
    if (!formData.documento_facturacion.trim()) {
      newErrors.documento_facturacion = 'El documento es requerido';
    }
    if (!formData.telefono_facturacion.trim()) {
      newErrors.telefono_facturacion = 'El teléfono es requerido';
    }
    if (!formData.email_facturacion.trim()) {
      newErrors.email_facturacion = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_facturacion)) {
      newErrors.email_facturacion = 'El email no es válido';
    }
    
    // Validar datos de tarjeta
    if (!formData.numero_tarjeta.trim()) {
      newErrors.numero_tarjeta = 'El número de tarjeta es requerido';
    } else if (!/^\d{16}$/.test(formData.numero_tarjeta.replace(/\s/g, ''))) {
      newErrors.numero_tarjeta = 'El número de tarjeta debe tener 16 dígitos';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'El CVV es requerido';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos';
    }
    
    if (!formData.fecha_expiracion.trim()) {
      newErrors.fecha_expiracion = 'La fecha de expiración es requerida';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.fecha_expiracion)) {
      newErrors.fecha_expiracion = 'Formato inválido (MM/AA)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEnvio = () => {
    if (!requiereEnvio) return true;
    
    const newErrors = {};
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Procesar comandos de voz del checkout
  const processVoiceCommand = useCallback((command) => {
    // No procesar comandos mientras todavía está escuchando
    if (isListening) {
      console.log('⏸️ Esperando a que termine el reconocimiento...');
      return;
    }
    
    const cmd = command.toLowerCase().trim();
    console.log('Comando checkout recibido:', cmd);
    
    // Prevenir procesamiento duplicado del mismo comando
    // EXCEPCIÓN: Si es "confirmar compra" y ya se leyó el resumen, permitir procesarlo de nuevo
    const esConfirmarCompra = cmd.includes('confirmar compra') || cmd.includes('confirmar') || 
                               cmd.includes('finalizar compra') || cmd.includes('finalizar') || 
                               cmd.includes('comprar') || cmd.includes('pagar');
    
    const now = Date.now();
    if (cmd === lastProcessedCommandRef.current && !(esConfirmarCompra && resumenLeido)) {
      console.log('⏭️ Comando duplicado ignorado');
      return;
    }
    
    // Resetear la bandera de comando procesado
    commandProcessedSuccessfullyRef.current = false;
    
    // Si es confirmar compra y ya se leyó el resumen, actualizar el comando para permitir la confirmación
    if (esConfirmarCompra && resumenLeido) {
      lastProcessedCommandRef.current = cmd + '_confirmar'; // Cambiar el comando para que no se detecte como duplicado
    } else {
      lastProcessedCommandRef.current = cmd;
    }

    // Comando de ayuda
    if (cmd.includes('ayuda') || cmd.includes('comandos') || cmd.includes('qué puedo decir')) {
      commandProcessedSuccessfullyRef.current = true;
      let ayudaTexto = '';
      
      if (step === 1) {
        ayudaTexto = 'En este paso puedes decir: ' +
                     'Mi nombre es seguido de tu nombre. ' +
                     'Mi documento es seguido del número. ' +
                     'Mi teléfono es seguido del número. ' +
                     'Mi correo es seguido de tu email, puedes decir arroba para el símbolo. ' +
                     'Mi tarjeta es seguido de los 16 dígitos. ' +
                     'CVV seguido de los 3 o 4 dígitos. ' +
                     'Vencimiento seguido de mes y año. ' +
                     'También puedes decir siguiente para continuar o cancelar para salir.';
      } else if (step === 2) {
        ayudaTexto = 'En este paso puedes decir: ' +
                     'Con envío para envío a domicilio. ' +
                     'Sin envío para recogida en tienda. ' +
                     'Mi dirección es seguido de tu dirección. ' +
                     'Mi ciudad es seguido de tu ciudad. ' +
                     'Código postal seguido del código. ' +
                     'También puedes decir siguiente, atrás, o cancelar.';
      } else if (step === 3) {
        ayudaTexto = 'En este paso puedes decir: ' +
                     'Confirmar compra para finalizar tu pedido. ' +
                     'Atrás para volver al paso anterior. ' +
                     'Cancelar para cerrar.';
      }
      
      speak(ayudaTexto);
      clearTranscript();
      return;
    }

    // Comandos de navegación
    if (cmd.includes('siguiente') || cmd.includes('continuar')) {
      commandProcessedSuccessfullyRef.current = true;
      handleNextStep();
      clearTranscript();
      return;
    }

    if (cmd.includes('atrás') || cmd.includes('volver') || cmd.includes('anterior')) {
      commandProcessedSuccessfullyRef.current = true;
      handlePrevStep();
      clearTranscript();
      return;
    }

    if (cmd.includes('cancelar') || cmd.includes('cerrar') || cmd.includes('salir')) {
      commandProcessedSuccessfullyRef.current = true;
      speak('Cerrando el proceso de compra');
      onClose();
      clearTranscript();
      return;
    }

    // PASO 1: Comandos de facturación
    if (step === 1) {
      // Nombre
      if (cmd.includes('mi nombre es') || cmd.includes('me llamo')) {
        commandProcessedSuccessfullyRef.current = true;
        const nombre = cmd.replace(/mi nombre es|me llamo|nombre/g, '').trim();
        if (nombre) {
          // Capitalizar primera letra de cada palabra
          const nombreCapitalizado = nombre.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          setFormData(prev => ({ ...prev, nombre_facturacion: nombreCapitalizado }));
          speak(`${nombreCapitalizado} registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.nombre_facturacion;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('documento_facturacion');
          pedirSiguienteCampo('documento_facturacion');
        } else {
          speak('No escuché el nombre. Por favor, repítelo.');
        }
        clearTranscript();
        return;
      }

      // Documento
      // Detectar si es comando de documento o si estamos en el campo de documento y solo hay números
      const esComandoDocumento = cmd.includes('mi documento es') || cmd.includes('mi cédula es') || cmd.includes('mi cedula es');
      const esSoloNumerosEnDocumento = currentField === 'documento_facturacion' && 
                                        (accumulatedNumbersRef.current.length > 0 || 
                                         /^[\d\s]+$/.test(convertirNumerosADigitos(cmd).replace(/[^\d\s]/g, '')));
      
      if (esComandoDocumento || esSoloNumerosEnDocumento) {
        commandProcessedSuccessfullyRef.current = true;
        
        let documentoTexto = '';
        
        // Si el comando incluye "mi documento es", usar ese texto
        if (esComandoDocumento) {
          documentoTexto = cmd.replace(/mi documento es|mi cédula es|mi cedula es|documento|cédula|cedula/g, '').trim();
        } else {
          // Si solo son números (modo acumulación), usar los números acumulados o el texto actual
          documentoTexto = accumulatedNumbersRef.current || cmd;
        }
        
        // Convertir números en palabras a dígitos
        documentoTexto = convertirNumerosADigitos(documentoTexto);
        const documento = documentoTexto.replace(/\s/g, '').replace(/\D/g, '');
        
        // Limpiar acumulador después de usar
        accumulatedNumbersRef.current = '';
        
        console.log('📄 Documento procesado:', documento);
        
        if (documento && documento.length >= 6) {
          setFormData(prev => ({ ...prev, documento_facturacion: documento }));
          speak(`Documento registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.documento_facturacion;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('telefono_facturacion');
          pedirSiguienteCampo('telefono_facturacion');
        } else {
          speak('El documento debe tener al menos 6 dígitos. Repítelo.');
        }
        clearTranscript();
        return;
      }

      // Teléfono
      if (cmd.includes('mi teléfono es') || cmd.includes('mi telefono es')) {
        commandProcessedSuccessfullyRef.current = true;
        let telefonoTexto = cmd.replace(/mi teléfono es|mi telefono es|teléfono|telefono/g, '').trim();
        telefonoTexto = convertirNumerosADigitos(telefonoTexto);
        const telefono = telefonoTexto.replace(/\s/g, '').replace(/\D/g, '');
        
        console.log('📞 Teléfono procesado:', telefono);
        
        if (telefono && telefono.length >= 7) {
          setFormData(prev => ({ ...prev, telefono_facturacion: telefono }));
          speak(`Teléfono registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.telefono_facturacion;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('email_facturacion');
          pedirSiguienteCampo('email_facturacion');
        } else {
          speak('El teléfono debe tener al menos 7 dígitos. Repítelo.');
        }
        clearTranscript();
        return;
      }

      // Email
      if (cmd.includes('mi correo es') || cmd.includes('mi email es')) {
        commandProcessedSuccessfullyRef.current = true;
        let email = cmd.replace(/mi correo es|mi email es|correo|email/g, '').trim();
        email = email.replace(/\sarroba\s/g, '@').replace(/arroba/g, '@');
        email = email.replace(/\spunto\s/g, '.').replace(/punto\scom/g, '.com');
        email = email.replace(/\s/g, '');
        
        if (email) {
          setFormData(prev => ({ ...prev, email_facturacion: email }));
          speak(`Correo registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email_facturacion;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('numero_tarjeta');
          pedirSiguienteCampo('numero_tarjeta');
        } else {
          speak('No escuché el correo. Por favor, repítelo.');
        }
        clearTranscript();
        return;
      }

      // Tarjeta
      if (cmd.includes('mi tarjeta es') || cmd.includes('tarjeta')) {
        commandProcessedSuccessfullyRef.current = true;
        let tarjetaTexto = cmd.replace(/mi tarjeta es|tarjeta/g, '').trim();
        tarjetaTexto = convertirNumerosADigitos(tarjetaTexto);
        const tarjeta = tarjetaTexto.replace(/\s/g, '').replace(/\D/g, '');
        
        console.log('💳 Tarjeta procesada:', tarjeta);
        
        if (tarjeta && tarjeta.length >= 15) {
          const formateada = tarjeta.replace(/(\d{4})/g, '$1 ').trim();
          setFormData(prev => ({ ...prev, numero_tarjeta: formateada }));
          speak(`Tarjeta registrada.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.numero_tarjeta;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('cvv');
          pedirSiguienteCampo('cvv');
        } else {
          speak('La tarjeta debe tener al menos 15 dígitos. Repítela.');
        }
        clearTranscript();
        return;
      }

      // CVV
      if (cmd.includes('cvv') || cmd.includes('código de seguridad')) {
        commandProcessedSuccessfullyRef.current = true;
        let cvvTexto = cmd.replace(/cvv|código de seguridad|codigo de seguridad/g, '').trim();
        cvvTexto = convertirNumerosADigitos(cvvTexto);
        const cvv = cvvTexto.replace(/\s/g, '').replace(/\D/g, '');
        
        console.log('🔐 CVV procesado:', cvv);
        
        if (cvv && cvv.length >= 3 && cvv.length <= 4) {
          setFormData(prev => ({ ...prev, cvv: cvv }));
          speak(`CVV registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.cvv;
            return newErrors;
          });
          
          // Avanzar al siguiente campo
          setCurrentField('fecha_expiracion');
          pedirSiguienteCampo('fecha_expiracion');
        } else {
          speak('El CVV debe tener 3 o 4 dígitos. Repítelo.');
        }
        clearTranscript();
        return;
      }

      // Vencimiento
      if (cmd.includes('vencimiento') || cmd.includes('expiración') || cmd.includes('expira')) {
        commandProcessedSuccessfullyRef.current = true;
        let fechaTexto = cmd.replace(/vencimiento|expiración|expira|fecha de vencimiento|fecha de expiración/g, '').trim();
        fechaTexto = convertirNumerosADigitos(fechaTexto);
        let fecha = fechaTexto.replace(/\s/g, '').replace(/\D/g, '');
        
        console.log('📅 Fecha de vencimiento procesada:', fecha);
        
        // Formatear MM/AA
        if (fecha.length >= 4) {
          fecha = fecha.substring(0, 2) + '/' + fecha.substring(2, 4);
          setFormData(prev => ({ ...prev, fecha_expiracion: fecha }));
          speak(`Vencimiento registrado. Datos de facturación completados.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.fecha_expiracion;
            return newErrors;
          });
          
          // Todos los campos del paso 1 completados, pedir avanzar
          pedirSiguienteCampo('completado_paso1');
        } else {
          speak('La fecha debe tener mes y año. Por ejemplo: 12 25. Repítela.');
        }
        clearTranscript();
        return;
      }
    }

    // PASO 2: Comandos de envío
    if (step === 2) {
      // Con envío
      if (cmd.includes('con envío') || cmd.includes('con envio') || cmd.includes('envío a domicilio')) {
        commandProcessedSuccessfullyRef.current = true;
        setRequiereEnvio(true);
        speak('Has seleccionado envío a domicilio. Por favor indica tu dirección');
        clearTranscript();
        return;
      }

      // Sin envío
      if (cmd.includes('sin envío') || cmd.includes('sin envio') || cmd.includes('recogida en tienda') || cmd.includes('recoger en tienda')) {
        commandProcessedSuccessfullyRef.current = true;
        setRequiereEnvio(false);
        speak(`Has seleccionado recogida en tienda. Podrás recoger tu pedido en: ${tiendaSeleccionada}`);
        clearTranscript();
        return;
      }

      // Dirección
      if (cmd.includes('mi dirección es') || cmd.includes('mi direccion es') || cmd.includes('dirección') || cmd.includes('direccion')) {
        commandProcessedSuccessfullyRef.current = true;
        const direccion = cmd.replace(/mi dirección es|mi direccion es|dirección|direccion/g, '').trim();
        if (direccion) {
          setFormData(prev => ({ ...prev, direccion: direccion }));
          speak(`Dirección registrada`);
        } else {
          speak('No escuché la dirección. Por favor, repítela.');
        }
        clearTranscript();
        return;
      }

      // Ciudad
      if (cmd.includes('mi ciudad es') || cmd.includes('ciudad')) {
        commandProcessedSuccessfullyRef.current = true;
        const ciudad = cmd.replace(/mi ciudad es|ciudad/g, '').trim();
        if (ciudad) {
          setFormData(prev => ({ ...prev, ciudad: ciudad }));
          speak(`Ciudad registrada: ${ciudad}`);
        } else {
          speak('No escuché la ciudad. Por favor, repítela.');
        }
        clearTranscript();
        return;
      }

      // Código postal
      if (cmd.includes('código postal') || cmd.includes('codigo postal') || cmd.includes('postal')) {
        commandProcessedSuccessfullyRef.current = true;
        let codigoTexto = cmd.replace(/código postal|codigo postal|postal/g, '').trim();
        // Convertir números en palabras a dígitos
        codigoTexto = convertirNumerosADigitos(codigoTexto);
        const codigo = codigoTexto.replace(/\s/g, '').replace(/\D/g, ''); // Solo dígitos
        
        console.log('📮 Código postal procesado:', codigo);
        
        if (codigo) {
          setFormData(prev => ({ ...prev, codigo_postal: codigo }));
          speak(`Código postal registrado.`);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.codigo_postal;
            return newErrors;
          });
        } else {
          speak('No se detectó un código postal válido. Por favor, repítelo.');
        }
        clearTranscript();
        return;
      }
    }

    // PASO 3: Confirmación
    if (step === 3) {
      if (cmd.includes('confirmar compra') || cmd.includes('confirmar') || cmd.includes('finalizar compra') || cmd.includes('finalizar') || cmd.includes('comprar') || cmd.includes('pagar')) {
        commandProcessedSuccessfullyRef.current = true;
        
        console.log('🔍 Estado resumenLeido:', resumenLeido);
        
        // Si aún no se ha leído el resumen, leerlo primero
        if (!resumenLeido) {
          console.log('📋 Leyendo resumen de datos por primera vez...');
          setResumenLeido(true);
          const resumen = leerResumenDatos();
          speak(resumen);
          clearTranscript();
          // Limpiar el comando procesado para permitir la segunda confirmación
          lastProcessedCommandRef.current = '';
          return;
        }
        
        // Si ya se leyó el resumen, proceder con la confirmación
        console.log('✅ Confirmando compra después de leer resumen...');
        speak('Procesando tu compra. Por favor espera');
        handleConfirmPurchase();
        clearTranscript();
        return;
      }
    }
    
    // También reconocer "finalizar compra" en otros pasos (por si el usuario lo dice)
    if (cmd.includes('finalizar compra') || cmd.includes('terminar compra') || cmd.includes('comprar') || cmd.includes('pagar')) {
      // Si estamos en paso 1 o 2, indicar que debe completar los pasos anteriores
      if (step === 1) {
        commandProcessedSuccessfullyRef.current = true;
        speak('Por favor completa los datos de facturación primero. Di siguiente cuando termines.');
        clearTranscript();
        return;
      } else if (step === 2) {
        commandProcessedSuccessfullyRef.current = true;
        speak('Por favor completa los datos de envío primero. Di siguiente cuando termines.');
        clearTranscript();
        return;
      }
    }

    // Comando no reconocido
    // Solo mostrar mensaje de error si el comando NO fue procesado exitosamente
    if (cmd.length > 3 && !commandProcessedSuccessfullyRef.current) {
      console.log('❌ Comando no reconocido:', cmd);
      speak('Comando no reconocido. Di "ayuda" para escuchar los comandos disponibles');
      clearTranscript();
    }
  }, [step, speak, clearTranscript, onClose, tiendaSeleccionada, pedirSiguienteCampo, isListening, currentField]);

  const handleNextStep = () => {
    if (step === 1) {
      if (validateFacturacion()) {
        setStep(2);
      } else {
        speak('Por favor completa todos los campos requeridos de facturación y pago');
      }
    } else if (step === 2) {
      if (validateEnvio()) {
        setStep(3);
      } else {
        speak('Por favor completa los datos de envío');
      }
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Función para leer resumen de datos antes de confirmar
  const leerResumenDatos = useCallback(() => {
    let resumen = 'Resumen de tu compra. ';
    
    // Productos en el carrito
    if (cartItems.length > 0) {
      resumen += `Productos: `;
      cartItems.forEach((item, index) => {
        resumen += `${item.quantity} ${item.name}`;
        if (index < cartItems.length - 1) {
          resumen += ', ';
        }
      });
      resumen += '. ';
    }
    
    // Datos de facturación
    resumen += `Nombre: ${formData.nombre_facturacion || 'no registrado'}. `;
    resumen += `Documento: ${formData.documento_facturacion || 'no registrado'}. `;
    resumen += `Teléfono: ${formData.telefono_facturacion || 'no registrado'}. `;
    resumen += `Correo: ${formData.email_facturacion || 'no registrado'}. `;
    
    // Datos de pago
    if (formData.numero_tarjeta) {
      const ultimos4 = formData.numero_tarjeta.replace(/\s/g, '').slice(-4);
      resumen += `Tarjeta terminada en: ${ultimos4}. `;
    }
    
    // Datos de envío
    if (requiereEnvio) {
      resumen += `Envío a domicilio. `;
      resumen += `Dirección: ${formData.direccion || 'no registrada'}. `;
      resumen += `Ciudad: ${formData.ciudad || 'no registrada'}. `;
      if (formData.codigo_postal) {
        resumen += `Código postal: ${formData.codigo_postal}. `;
      }
    } else {
      resumen += `Recogida en tienda: ${tiendaSeleccionada}. `;
    }
    
    // Totales
    resumen += `Subtotal: ${subtotal.toFixed(2)} pesos. `;
    resumen += `IVA: ${iva.toFixed(2)} pesos. `;
    resumen += `Total a pagar: ${total.toFixed(2)} pesos. `;
    resumen += `Si los datos son correctos, di confirmar compra nuevamente para finalizar.`;
    
    return resumen;
  }, [formData, requiereEnvio, tiendaSeleccionada, subtotal, iva, total, cartItems]);

  const handleConfirmPurchase = async () => {
    setLoading(true);
    
    const checkoutData = {
      compra: {
        usuario: 3, // ID del usuario cliente_test
        nombre_facturacion: formData.nombre_facturacion,
        documento_facturacion: formData.documento_facturacion,
        telefono_facturacion: formData.telefono_facturacion,
        email_facturacion: formData.email_facturacion,
        requiere_envio: requiereEnvio,
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: total.toFixed(2)
      },
      articulos: cartItems.map(item => ({
        usuario: 3, // ID del usuario cliente_test
        producto: item.id,
        cantidad: item.quantity
      })),
      requiere_envio: requiereEnvio,
      envio: requiereEnvio ? {
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        codigo_postal: formData.codigo_postal || '',
        notas_adicionales: formData.notas_adicionales || ''
      } : null
    };
    
    try {
      await onCheckoutComplete(checkoutData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error al procesar la compra: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-modal-header">
          <h2>
            <i className="fas fa-shopping-cart"></i>
            Finalizar Compra
          </h2>
          <button className="btn-close-modal" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Indicador de Control por Voz */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '10px 20px',
          margin: '10px 20px 0',
          borderRadius: '8px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fas fa-microphone" style={{ fontSize: '16px' }}></i>
          <div style={{ flex: 1 }}>
            <strong>🎤 Control por Voz Activado</strong>
            <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
              Presiona ESPACIO y di: "mi nombre es...", "mi correo es...", "ayuda"
            </div>
          </div>
          {transcript && (
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '3px 10px',
              borderRadius: '15px',
              fontSize: '11px',
              fontStyle: 'italic',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              "{transcript}"
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Facturación</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Envío</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="checkout-modal-body">
          {/* PASO 1: Facturación */}
          {step === 1 && (
            <div className="checkout-step-content">
              <h3><i className="fas fa-file-invoice"></i> Datos de Facturación</h3>
              
              <div className="form-group">
                <label htmlFor="nombre_facturacion">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre_facturacion"
                  name="nombre_facturacion"
                  value={formData.nombre_facturacion}
                  onChange={handleInputChange}
                  className={errors.nombre_facturacion ? 'error' : ''}
                  placeholder="Juan Pérez García"
                />
                {errors.nombre_facturacion && <span className="error-message">{errors.nombre_facturacion}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="documento_facturacion">Documento de Identidad *</label>
                  <input
                    type="text"
                    id="documento_facturacion"
                    name="documento_facturacion"
                    value={formData.documento_facturacion}
                    onChange={handleInputChange}
                    className={errors.documento_facturacion ? 'error' : ''}
                    placeholder="1234567890"
                  />
                  {errors.documento_facturacion && <span className="error-message">{errors.documento_facturacion}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono_facturacion">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono_facturacion"
                    name="telefono_facturacion"
                    value={formData.telefono_facturacion}
                    onChange={handleInputChange}
                    className={errors.telefono_facturacion ? 'error' : ''}
                    placeholder="+57 300 123 4567"
                  />
                  {errors.telefono_facturacion && <span className="error-message">{errors.telefono_facturacion}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email_facturacion">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email_facturacion"
                  name="email_facturacion"
                  value={formData.email_facturacion}
                  onChange={handleInputChange}
                  className={errors.email_facturacion ? 'error' : ''}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email_facturacion && <span className="error-message">{errors.email_facturacion}</span>}
              </div>

              {/* Separador de sección de pago */}
              <div className="section-divider">
                <h4><i className="fas fa-credit-card"></i> Datos de Pago</h4>
              </div>

              <div className="form-group">
                <label htmlFor="numero_tarjeta">Número de Tarjeta *</label>
                <input
                  type="text"
                  id="numero_tarjeta"
                  name="numero_tarjeta"
                  value={formData.numero_tarjeta}
                  onChange={handleInputChange}
                  className={errors.numero_tarjeta ? 'error' : ''}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.numero_tarjeta && <span className="error-message">{errors.numero_tarjeta}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_expiracion">Fecha de Expiración *</label>
                  <input
                    type="text"
                    id="fecha_expiracion"
                    name="fecha_expiracion"
                    value={formData.fecha_expiracion}
                    onChange={handleInputChange}
                    className={errors.fecha_expiracion ? 'error' : ''}
                    placeholder="MM/AA"
                    maxLength="5"
                  />
                  {errors.fecha_expiracion && <span className="error-message">{errors.fecha_expiracion}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={errors.cvv ? 'error' : ''}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Envío */}
          {step === 2 && (
            <div className="checkout-step-content">
              <h3><i className="fas fa-shipping-fast"></i> Datos de Envío</h3>
              
              {/* Checkbox de envío */}
              <div className="form-group-checkbox">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={requiereEnvio}
                    onChange={(e) => setRequiereEnvio(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Deseo que me envíen el pedido a domicilio</span>
                </label>
              </div>

              {requiereEnvio ? (
                <>
                  <div className="form-group">
                    <label htmlFor="direccion">Dirección de Envío *</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={errors.direccion ? 'error' : ''}
                      placeholder="Calle 123 #45-67, Apto 101"
                    />
                    {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="ciudad">Ciudad *</label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className={errors.ciudad ? 'error' : ''}
                        placeholder="Bogotá"
                      />
                      {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="codigo_postal">Código Postal</label>
                      <input
                        type="text"
                        id="codigo_postal"
                        name="codigo_postal"
                        value={formData.codigo_postal}
                        onChange={handleInputChange}
                        placeholder="110111"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notas_adicionales">Notas Adicionales</label>
                    <textarea
                      id="notas_adicionales"
                      name="notas_adicionales"
                      value={formData.notas_adicionales}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Instrucciones especiales para la entrega..."
                    ></textarea>
                  </div>
                </>
              ) : (
                <div className="pickup-info">
                  <div className="info-box">
                    <i className="fas fa-store"></i>
                    <h4>Recogida en Tienda</h4>
                    <p>Podrás recoger tu pedido en nuestra tienda más cercana:</p>
                    <div className="store-address">
                      <i className="fas fa-map-marker-alt"></i>
                      <strong>{tiendaSeleccionada}</strong>
                    </div>
                    <p className="store-hours">
                      <i className="fas fa-clock"></i>
                      Horario: Lunes a Sábado 9:00 AM - 7:00 PM
                    </p>
                    <p className="pickup-time">
                      <i className="fas fa-info-circle"></i>
                      Tu pedido estará listo en aproximadamente 2-4 horas
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 3: Confirmación */}
          {step === 3 && (
            <div className="checkout-step-content">
              <h3><i className="fas fa-check-circle"></i> Confirmar Compra</h3>
              
              <div className="confirmation-summary">
                <div className="summary-section">
                  <h4><i className="fas fa-file-invoice"></i> Datos de Facturación</h4>
                  <p><strong>Nombre:</strong> {formData.nombre_facturacion}</p>
                  <p><strong>Documento:</strong> {formData.documento_facturacion}</p>
                  <p><strong>Teléfono:</strong> {formData.telefono_facturacion}</p>
                  <p><strong>Email:</strong> {formData.email_facturacion}</p>
                </div>

                <div className="summary-section">
                  <h4><i className="fas fa-credit-card"></i> Método de Pago</h4>
                  <p><strong>Tarjeta:</strong> **** **** **** {formData.numero_tarjeta.slice(-4)}</p>
                  <p><strong>Vencimiento:</strong> {formData.fecha_expiracion}</p>
                </div>

                <div className="summary-section">
                  <h4><i className="fas fa-shipping-fast"></i> Datos de Entrega</h4>
                  {requiereEnvio ? (
                    <>
                      <p><strong>Dirección:</strong> {formData.direccion}</p>
                      <p><strong>Ciudad:</strong> {formData.ciudad}</p>
                      {formData.codigo_postal && <p><strong>Código Postal:</strong> {formData.codigo_postal}</p>}
                    </>
                  ) : (
                    <div className="pickup-summary">
                      <p><strong>Recogida en tienda:</strong></p>
                      <p>{tiendaSeleccionada}</p>
                    </div>
                  )}
                </div>

                <div className="summary-section">
                  <h4><i className="fas fa-shopping-bag"></i> Productos ({cartItems.length})</h4>
                  <div className="products-summary">
                    {cartItems.map(item => (
                      <div key={item.id} className="product-summary-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-section totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>IVA (19%):</span>
                    <span>${iva.toFixed(2)}</span>
                  </div>
                  <div className="total-row final">
                    <strong>Total a Pagar:</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="checkout-modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handlePrevStep}>
              <i className="fas fa-arrow-left"></i>
              Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button className="btn btn-primary" onClick={handleNextStep}>
              Siguiente
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button 
              className="btn btn-success" 
              onClick={handleConfirmPurchase}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Confirmar Compra
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
