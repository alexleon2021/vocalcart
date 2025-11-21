#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🔍 DIAGNÓSTICO DE CONECTIVIDAD - VOCALCART          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar conexión a internet
echo "1️⃣  Verificando conexión a internet..."
if ping -c 1 -W 2 8.8.8.8 &> /dev/null; then
    echo -e "${GREEN}✅ Conexión a internet: OK${NC}"
else
    echo -e "${RED}❌ Sin conexión a internet${NC}"
    echo "   Solución: Conecta tu computadora a internet"
    exit 1
fi
echo ""

# 2. Verificar DNS
echo "2️⃣  Verificando resolución DNS..."
if ping -c 1 -W 2 google.com &> /dev/null; then
    echo -e "${GREEN}✅ DNS funcionando: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Problema con DNS${NC}"
    echo "   Solución: Usa DNS público (8.8.8.8)"
fi
echo ""

# 3. Verificar HTTPS a Google
echo "3️⃣  Verificando acceso HTTPS a Google..."
if curl -s -I https://www.google.com | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Acceso HTTPS a Google: OK${NC}"
else
    echo -e "${RED}❌ No se puede acceder a Google por HTTPS${NC}"
    echo "   Posibles causas:"
    echo "   - Firewall bloqueando puerto 443"
    echo "   - Antivirus bloqueando conexión"
    echo "   - Proxy/VPN interfiriendo"
fi
echo ""

# 4. Verificar Backend Django
echo "4️⃣  Verificando Backend Django (puerto 8000)..."
if curl -s http://localhost:8000 &> /dev/null; then
    echo -e "${GREEN}✅ Backend Django: Corriendo${NC}"
else
    echo -e "${RED}❌ Backend Django: No está corriendo${NC}"
    echo "   Inicia el servidor:"
    echo "   cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart"
    echo "   /home/d4n7dev/Escritorio/DEV/vocalcart/envvocalcart/bin/python manage.py runserver"
fi
echo ""

# 5. Verificar Frontend React
echo "5️⃣  Verificando Frontend React (puerto 5173)..."
if curl -s http://localhost:5173 &> /dev/null; then
    echo -e "${GREEN}✅ Frontend React: Corriendo${NC}"
else
    echo -e "${RED}❌ Frontend React: No está corriendo${NC}"
    echo "   Inicia el servidor:"
    echo "   cd /home/d4n7dev/Escritorio/DEV/vocalcart/vocalcart/front"
    echo "   npm run dev"
fi
echo ""

# 6. Verificar firewall UFW (Linux)
echo "6️⃣  Verificando Firewall UFW..."
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        echo -e "${YELLOW}⚠️  Firewall UFW está activo${NC}"
        echo "   Si el reconocimiento falla, permite puerto 443:"
        echo "   sudo ufw allow out to any port 443"
    else
        echo -e "${GREEN}✅ Firewall UFW: Inactivo${NC}"
    fi
else
    echo -e "${GREEN}✅ UFW no instalado${NC}"
fi
echo ""

# 7. Verificar extensiones comunes que bloquean
echo "7️⃣  Recomendaciones para extensiones del navegador:"
echo "   Desactiva temporalmente en chrome://extensions:"
echo "   - uBlock Origin / AdBlock"
echo "   - Privacy Badger"
echo "   - Ghostery"
echo "   - NoScript"
echo ""

# Resumen
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                        📋 RESUMEN                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Si todo está ✅ pero aún tienes error de red:"
echo ""
echo "1️⃣  PRUEBA EN MODO INCÓGNITO:"
echo "   Ctrl + Shift + N → http://localhost:5173"
echo ""
echo "2️⃣  DESACTIVA EXTENSIONES:"
echo "   chrome://extensions → Desactiva todas"
echo ""
echo "3️⃣  VERIFICA ANTIVIRUS:"
echo "   Desactiva temporalmente tu antivirus"
echo ""
echo "4️⃣  REVISA PROXY/VPN:"
echo "   Desconecta cualquier VPN o proxy"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    🎯 SIGUIENTE PASO                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Abre Chrome en modo incógnito y ve a:"
echo "👉 http://localhost:5173"
echo ""
