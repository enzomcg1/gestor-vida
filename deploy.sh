#!/bin/bash

# 🚀 Script de Despliegue para Render
# Este script automatiza el proceso de despliegue

echo "🚀 Iniciando proceso de despliegue para Render..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Por favor instálalo primero."
    exit 1
fi

print_status "Verificaciones previas completadas"

# Instalar dependencias
print_status "Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    print_error "Error al instalar dependencias"
    exit 1
fi

# Generar cliente de Prisma
print_status "Generando cliente de Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    print_error "Error al generar cliente de Prisma"
    exit 1
fi

# Verificar que la base de datos esté configurada
if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL no está configurada. Asegúrate de configurarla en Render."
fi

# Sincronizar base de datos
print_status "Sincronizando base de datos..."
npx prisma db push

if [ $? -ne 0 ]; then
    print_error "Error al sincronizar base de datos"
    exit 1
fi

# Build de la aplicación
print_status "Construyendo aplicación para producción..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Error al construir la aplicación"
    exit 1
fi

print_status "Build completado exitosamente"

# Verificar que el build se haya creado
if [ ! -d ".next" ]; then
    print_error "Directorio .next no encontrado. El build falló."
    exit 1
fi

print_status "✅ Aplicación lista para despliegue en Render"

echo ""
echo "📋 Próximos pasos:"
echo "1. Sube tu código a GitHub/GitLab/Bitbucket"
echo "2. Crea un servicio web en Render"
echo "3. Configura las variables de entorno"
echo "4. Configura los comandos de build y start"
echo "5. ¡Despliega!"
echo ""
echo "🔗 URL de tu aplicación: https://tu-app-name.onrender.com"
echo "🔑 Usuario de prueba: default@gestor-vida.com / password123"
echo ""
echo "📖 Para más detalles, consulta DEPLOYMENT.md"
