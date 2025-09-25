# 🎯 Gestor de Vida

Una aplicación web completa para la gestión personal que incluye tareas, rutinas, finanzas y ahorros.

## ✨ Características

- 🔐 **Autenticación Multi-usuario**: Sistema de login/registro seguro
- ✅ **Gestión de Tareas**: Organiza tus tareas con prioridades y fechas límite
- 🔄 **Rutinas**: Establece y mantén hábitos saludables
- 💰 **Control Financiero**: Gestiona ingresos, gastos y transacciones recurrentes
- 🏦 **Metas de Ahorro**: Define objetivos y haz seguimiento de tu progreso
- 📊 **Dashboard Interactivo**: Visualiza tu progreso con gráficos y estadísticas
- 📱 **Responsive**: Funciona perfectamente en móviles y escritorio

## 🚀 Despliegue Rápido

### Opción 1: Desplegar en Render (Recomendado)

1. **Fork este repositorio**
2. **Ve a [render.com](https://render.com)**
3. **Crea un nuevo servicio web**
4. **Conecta tu repositorio**
5. **Configura las variables de entorno**:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
   NEXTAUTH_SECRET=tu-clave-secreta-aqui
   NEXTAUTH_URL=https://tu-app-name.onrender.com
   ```
6. **Configura los comandos**:
   - Build: `npm install && npx prisma generate && npx prisma db push`
   - Start: `npm start`
7. **¡Despliega!**

### Opción 2: Despliegue Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/gestor-vida.git
cd gestor-vida

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Generar cliente de Prisma
npx prisma generate

# Sincronizar base de datos
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15.5.4, React 19.1.0, Tailwind CSS v4
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Despliegue**: Render.com
- **Lenguaje**: TypeScript

## 📱 Capturas de Pantalla

### Dashboard Principal
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Principal)

### Gestión de Tareas
![Tareas](https://via.placeholder.com/800x400/059669/FFFFFF?text=Gestión+de+Tareas)

### Control Financiero
![Finanzas](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Control+Financiero)

## 🔑 Cuentas de Prueba

### Usuario por Defecto:
```
Email: default@gestor-vida.com
Contraseña: password123
```

## 📊 Funcionalidades Detalladas

### 🎯 Tareas
- Crear, editar y eliminar tareas
- Asignar prioridades (Alta, Media, Baja)
- Establecer fechas límite
- Marcar como completadas
- Filtros y búsqueda

### 🔄 Rutinas
- Crear rutinas diarias, semanales o mensuales
- Seguimiento de completitud
- Estadísticas de progreso
- Recordatorios automáticos

### 💰 Finanzas
- Registro de ingresos y gastos
- Categorización de transacciones
- Transacciones recurrentes automáticas
- Análisis de patrones de gasto
- Exportación de datos

### 🏦 Ahorros
- Definir metas de ahorro
- Seguimiento de progreso
- Contribuciones manuales
- Alertas de vencimiento
- Visualización de logros

## 🛠️ Desarrollo

### Estructura del Proyecto

```
gestor-vida/
├── src/
│   ├── app/                 # Páginas de Next.js
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Páginas de autenticación
│   │   └── ...             # Otras páginas
│   ├── components/         # Componentes React
│   └── lib/               # Utilidades y configuración
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── public/                # Archivos estáticos
└── ...                    # Archivos de configuración
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter

# Base de datos
npx prisma generate  # Generar cliente de Prisma
npx prisma db push   # Sincronizar esquema con BD
npx prisma studio    # Abrir Prisma Studio
```

## 🔒 Seguridad

- Autenticación segura con NextAuth.js
- Contraseñas hasheadas con bcryptjs
- Validación de datos en frontend y backend
- Headers de seguridad configurados
- Protección CSRF

## 📈 Rendimiento

- Optimización de imágenes con Next.js
- Lazy loading de componentes
- Compresión gzip
- Caché de API responses
- Optimización de consultas de base de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Documentación**: [docs.gestor-vida.com](https://docs.gestor-vida.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/gestor-vida/issues)
- **Email**: soporte@gestor-vida.com

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework de React
- [Prisma](https://prisma.io/) - ORM para TypeScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [NextAuth.js](https://next-auth.js.org/) - Autenticación para Next.js
- [Render](https://render.com/) - Plataforma de despliegue

---

**¡Gracias por usar Gestor de Vida! 🎉**