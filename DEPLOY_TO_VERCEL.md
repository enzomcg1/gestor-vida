# 🚀 Guía Completa de Despliegue en Vercel

## 📋 Resumen del Proyecto

**Gestor de Vida** - Aplicación web completa para gestión personal que incluye:
- ✅ Sistema de autenticación multi-usuario
- ✅ Gestión de tareas y rutinas
- ✅ Control financiero con transacciones recurrentes
- ✅ Metas de ahorro con seguimiento
- ✅ Dashboard interactivo y reportes
- ✅ Base de datos PostgreSQL en la nube

## 🔧 Configuración Técnica

### Stack Tecnológico:
- **Frontend**: Next.js 15.5.4 + React 19.1.0
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Render)
- **Autenticación**: NextAuth.js v5
- **ORM**: Prisma v6.16.2
- **Estilos**: Tailwind CSS v4
- **Despliegue**: Vercel.com

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de estar en el directorio correcto
cd gestor-vida

# Verificar que todos los archivos estén presentes
ls -la

# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Preparar para despliegue en Vercel"

# Conectar con repositorio remoto (GitHub/GitLab/Bitbucket)
git remote add origin https://github.com/tu-usuario/gestor-vida.git
git push -u origin main
```

### 2. Crear Proyecto en Vercel

1. **Acceder a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión o crea una cuenta
   - Conecta tu cuenta de GitHub/GitLab/Bitbucket

2. **Importar Proyecto**
   - Haz clic en "New Project"
   - Selecciona tu repositorio `gestor-vida`
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar el Proyecto**
   ```
   Framework Preset: Next.js
   Root Directory: gestor-vida
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 3. Configurar Variables de Entorno

En la sección "Environment Variables" de Vercel, agrega:

```
NODE_ENV = production
DATABASE_URL = postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
NEXTAUTH_SECRET = n2/Qd/1xV4owx75Or+xZGDE+rEz2HgUps5iT86EzfBA=
NEXTAUTH_URL = https://tu-proyecto.vercel.app
NEXT_TELEMETRY_DISABLED = 1
```

### 4. Configurar Build Settings

Vercel detectará automáticamente Next.js, pero puedes verificar:

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 5. Configurar Base de Datos

Vercel puede conectarse a tu base de datos PostgreSQL existente en Render, o puedes:

1. **Usar la base de datos existente** (Recomendado)
   - Usa la misma `DATABASE_URL` de Render
   - No necesitas migrar datos

2. **Crear nueva base de datos en Vercel**
   - Ve a "Storage" en tu dashboard de Vercel
   - Crea una nueva base de datos PostgreSQL
   - Actualiza la `DATABASE_URL`

## 🔄 Proceso de Despliegue Automático

### Comandos que se ejecutarán automáticamente:

1. **Instalación de dependencias**
   ```bash
   npm install
   ```

2. **Build de la aplicación**
   ```bash
   npm run build
   ```

3. **Deploy automático**
   - Vercel optimiza automáticamente para producción
   - Genera builds estáticos cuando es posible
   - Configura CDN global

## 🌐 Acceso a la Aplicación

Una vez desplegada, tu aplicación estará disponible en:
```
https://tu-proyecto.vercel.app
```

## 🔑 Cuentas de Prueba

### Usuario por Defecto:
```
Email: default@gestor-vida.com
Contraseña: password123
```

## 📊 Monitoreo y Logs

### Logs Disponibles:
- **Build logs**: Proceso de construcción
- **Function logs**: Logs de las API routes
- **Edge logs**: Logs de funciones edge
- **Analytics**: Métricas de rendimiento

### Métricas:
- **Core Web Vitals**: LCP, FID, CLS
- **Performance**: Tiempo de carga, TTFB
- **Usage**: Requests, bandwidth, function invocations

## 🔧 Solución de Problemas

### Error de Build:
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel
- Asegúrate de que Node.js esté configurado correctamente

### Error de Base de Datos:
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté accesible desde Vercel
- Revisa los logs de Prisma

### Error de Autenticación:
- Verifica que `NEXTAUTH_SECRET` esté configurada
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio de Vercel
- Revisa los logs de NextAuth

## 🚀 Optimizaciones para Producción

### 1. Configurar Dominio Personalizado (Opcional)
- Ve a "Domains" en tu proyecto de Vercel
- Agrega tu dominio personalizado
- Configura los registros DNS

### 2. Configurar SSL
- Vercel proporciona SSL automáticamente
- Certificados Let's Encrypt incluidos

### 3. Configurar Variables de Entorno Adicionales
```
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 📈 Escalabilidad

### Planes Disponibles:
- **Hobby**: Gratis - Para proyectos personales
- **Pro**: $20/mes - Para aplicaciones comerciales
- **Enterprise**: Contactar ventas - Para empresas

## 🔄 Despliegues Automáticos

Con Auto-Deploy habilitado:
- Cada push a la rama `main` activará un nuevo despliegue
- Los despliegues son automáticos y sin tiempo de inactividad
- Rollback disponible en caso de problemas
- Preview deployments para pull requests

## 📞 Soporte

- **Documentación**: [vercel.com/docs](https://vercel.com/docs)
- **Comunidad**: [vercel.com/community](https://vercel.com/community)
- **Soporte**: Disponible en todos los planes

---

## ✅ Checklist de Despliegue

- [ ] Repositorio en GitHub/GitLab/Bitbucket
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas
- [ ] Proyecto importado en Vercel
- [ ] Despliegue exitoso
- [ ] Aplicación accesible en la URL
- [ ] Login funcionando correctamente
- [ ] Todas las funcionalidades operativas

¡Tu Gestor de Vida estará listo para usar en producción! 🎉

## 🔧 Configuración Específica para NextAuth.js

### Variables de Entorno Requeridas:
```
NEXTAUTH_SECRET=n2/Qd/1xV4owx75Or+xZGDE+rEz2HgUps5iT86EzfBA=
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

### Configuración de Dominio:
- Vercel asigna automáticamente un dominio `.vercel.app`
- Puedes usar este dominio o configurar uno personalizado
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio

## 🗄️ Base de Datos

### Opción 1: Usar Base de Datos Existente (Render)
```
DATABASE_URL=postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
```

### Opción 2: Crear Nueva Base de Datos en Vercel
1. Ve a "Storage" en tu dashboard
2. Crea una nueva base de datos PostgreSQL
3. Copia la nueva `DATABASE_URL`
4. Ejecuta `npx prisma db push` para sincronizar el esquema

## 🚀 Comandos de Despliegue

### Despliegue Manual:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Despliegue Automático:
- Cada push a `main` activa un despliegue automático
- Pull requests crean preview deployments
- Rollback disponible desde el dashboard
