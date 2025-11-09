import { useState, useEffect, useCallback } from 'react';
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
  const { speak, transcript, clearTranscript } = useVoiceAssistant();
  
  // Direcciones de tiendas para recogida
  const tiendasDisponibles = [
    'Calle Principal #123, Centro Comercial Plaza Mayor, Bogotá',
    'Avenida Libertador #456, Local 5, Medellín',
    'Carrera 7 #890, Centro Empresarial, Cali',
    'Calle 50 #234, Centro Comercial El Retiro, Barranquilla'
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

  // Leer instrucciones al abrir el modal o cambiar de paso
  useEffect(() => {
    if (!isOpen) return;
    
    const instrucciones = {
      1: `Paso 1 de 3: Datos de Facturación y Pago. 
          Puedes dictar tus datos usando comandos de voz. 
          Di "mi nombre es" seguido de tu nombre completo.
          Di "mi documento es" seguido de tu número de documento.
          Di "mi teléfono es" seguido de tu teléfono.
          Di "mi correo es" seguido de tu email.
          Di "mi tarjeta es" seguido de los 16 dígitos de tu tarjeta.
          Di "CVV" seguido de los 3 dígitos.
          Di "vencimiento" seguido del mes y año en formato mes mes año año.
          Di "siguiente" para continuar al paso 2.`,
      
      2: `Paso 2 de 3: Datos de Envío. 
          Di "con envío" si quieres que te enviemos el pedido a domicilio.
          Di "sin envío" o "recogida en tienda" si prefieres recoger en tienda.
          Para envío a domicilio, di "mi dirección es" seguido de tu dirección completa.
          Di "mi ciudad es" seguido del nombre de tu ciudad.
          Di "código postal" seguido del código.
          Di "siguiente" para continuar, o "atrás" para volver.`,
      
      3: `Paso 3 de 3: Confirmación de compra.
          Por favor revisa que todos los datos sean correctos.
          Tu compra total es de ${total.toFixed(2)} dólares.
          Di "confirmar compra" para finalizar, o "atrás" para modificar datos.`
    };
    
    setTimeout(() => {
      speak(instrucciones[step]);
    }, 500);
  }, [step, isOpen, total, speak]);

  // Procesar comandos de voz
  useEffect(() => {
    if (!transcript || !isOpen) return;
    
    processVoiceCommand(transcript);
  }, [transcript, isOpen]);

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
    const cmd = command.toLowerCase().trim();
    console.log('Comando checkout recibido:', cmd);

    // Comando de ayuda
    if (cmd.includes('ayuda') || cmd.includes('comandos') || cmd.includes('qué puedo decir')) {
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
      handleNextStep();
      clearTranscript();
      return;
    }

    if (cmd.includes('atrás') || cmd.includes('volver') || cmd.includes('anterior')) {
      handlePrevStep();
      clearTranscript();
      return;
    }

    if (cmd.includes('cancelar') || cmd.includes('cerrar') || cmd.includes('salir')) {
      speak('Cerrando el proceso de compra');
      onClose();
      clearTranscript();
      return;
    }

    // PASO 1: Comandos de facturación
    if (step === 1) {
      // Nombre
      if (cmd.includes('mi nombre es') || cmd.includes('me llamo')) {
        const nombre = cmd.replace(/mi nombre es|me llamo/g, '').trim();
        if (nombre) {
          setFormData(prev => ({ ...prev, nombre_facturacion: nombre }));
          speak(`Nombre registrado: ${nombre}`);
        }
        clearTranscript();
        return;
      }

      // Documento
      if (cmd.includes('mi documento es') || cmd.includes('documento')) {
        const documento = cmd.replace(/mi documento es|documento/g, '').trim().replace(/\s/g, '');
        if (documento) {
          setFormData(prev => ({ ...prev, documento_facturacion: documento }));
          speak(`Documento registrado`);
        }
        clearTranscript();
        return;
      }

      // Teléfono
      if (cmd.includes('mi teléfono es') || cmd.includes('mi telefono es') || cmd.includes('teléfono') || cmd.includes('telefono')) {
        const telefono = cmd.replace(/mi teléfono es|mi telefono es|teléfono|telefono/g, '').trim();
        if (telefono) {
          setFormData(prev => ({ ...prev, telefono_facturacion: telefono }));
          speak(`Teléfono registrado`);
        }
        clearTranscript();
        return;
      }

      // Email
      if (cmd.includes('mi correo es') || cmd.includes('mi email es') || cmd.includes('correo')) {
        let email = cmd.replace(/mi correo es|mi email es|correo/g, '').trim();
        // Convertir "arroba" a @
        email = email.replace(/arroba/g, '@').replace(/\s/g, '');
        if (email) {
          setFormData(prev => ({ ...prev, email_facturacion: email }));
          speak(`Correo electrónico registrado`);
        }
        clearTranscript();
        return;
      }

      // Tarjeta
      if (cmd.includes('mi tarjeta es') || cmd.includes('tarjeta')) {
        const tarjeta = cmd.replace(/mi tarjeta es|tarjeta/g, '').trim().replace(/\s/g, '');
        if (tarjeta && tarjeta.length >= 15) {
          const formateada = tarjeta.replace(/(\d{4})/g, '$1 ').trim();
          setFormData(prev => ({ ...prev, numero_tarjeta: formateada }));
          speak(`Tarjeta registrada terminada en ${tarjeta.slice(-4)}`);
        }
        clearTranscript();
        return;
      }

      // CVV
      if (cmd.includes('cvv') || cmd.includes('código de seguridad')) {
        const cvv = cmd.replace(/cvv|código de seguridad/g, '').trim().replace(/\s/g, '');
        if (cvv && cvv.length >= 3) {
          setFormData(prev => ({ ...prev, cvv: cvv }));
          speak(`Código de seguridad registrado`);
        }
        clearTranscript();
        return;
      }

      // Vencimiento
      if (cmd.includes('vencimiento') || cmd.includes('expiración') || cmd.includes('expira')) {
        let fecha = cmd.replace(/vencimiento|expiración|expira/g, '').trim().replace(/\s/g, '');
        // Formatear MM/AA
        if (fecha.length >= 4) {
          fecha = fecha.substring(0, 2) + '/' + fecha.substring(2, 4);
          setFormData(prev => ({ ...prev, fecha_expiracion: fecha }));
          speak(`Fecha de vencimiento registrada`);
        }
        clearTranscript();
        return;
      }
    }

    // PASO 2: Comandos de envío
    if (step === 2) {
      // Con envío
      if (cmd.includes('con envío') || cmd.includes('con envio') || cmd.includes('envío a domicilio')) {
        setRequiereEnvio(true);
        speak('Has seleccionado envío a domicilio. Por favor indica tu dirección');
        clearTranscript();
        return;
      }

      // Sin envío
      if (cmd.includes('sin envío') || cmd.includes('sin envio') || cmd.includes('recogida en tienda') || cmd.includes('recoger en tienda')) {
        setRequiereEnvio(false);
        speak(`Has seleccionado recogida en tienda. Podrás recoger tu pedido en: ${tiendaSeleccionada}`);
        clearTranscript();
        return;
      }

      // Dirección
      if (cmd.includes('mi dirección es') || cmd.includes('mi direccion es') || cmd.includes('dirección')) {
        const direccion = cmd.replace(/mi dirección es|mi direccion es|dirección|direccion/g, '').trim();
        if (direccion) {
          setFormData(prev => ({ ...prev, direccion: direccion }));
          speak(`Dirección registrada`);
        }
        clearTranscript();
        return;
      }

      // Ciudad
      if (cmd.includes('mi ciudad es') || cmd.includes('ciudad')) {
        const ciudad = cmd.replace(/mi ciudad es|ciudad/g, '').trim();
        if (ciudad) {
          setFormData(prev => ({ ...prev, ciudad: ciudad }));
          speak(`Ciudad registrada: ${ciudad}`);
        }
        clearTranscript();
        return;
      }

      // Código postal
      if (cmd.includes('código postal') || cmd.includes('codigo postal') || cmd.includes('postal')) {
        const codigo = cmd.replace(/código postal|codigo postal|postal/g, '').trim().replace(/\s/g, '');
        if (codigo) {
          setFormData(prev => ({ ...prev, codigo_postal: codigo }));
          speak(`Código postal registrado`);
        }
        clearTranscript();
        return;
      }
    }

    // PASO 3: Confirmación
    if (step === 3) {
      if (cmd.includes('confirmar compra') || cmd.includes('confirmar') || cmd.includes('finalizar')) {
        speak('Procesando tu compra. Por favor espera');
        handleConfirmPurchase();
        clearTranscript();
        return;
      }
    }

    // Comando no reconocido
    if (cmd.length > 3) {
      speak('Comando no reconocido. Di "ayuda" para escuchar los comandos disponibles');
      clearTranscript();
    }
  }, [step, speak, clearTranscript, onClose, tiendaSeleccionada]);

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
