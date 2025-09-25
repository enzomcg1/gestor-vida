# 🚀 Guía de Despliegue en Render

## 📋 Requisitos Previos

1. **Cuenta en Render**: Regístrate en [render.com](https://render.com)
2. **Base de datos PostgreSQL**: Ya configurada en Render
3. **Repositorio Git**: Tu código debe estar en GitHub, GitLab o Bitbucket

## 🔧 Configuración de la Base de Datos

### Datos de tu Base de Datos PostgreSQL en Render:
```
Host: dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com
Port: 5432
Database: ergdatabase
Username: ergdatabase_user
Password: TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u
URL: postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
```

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio
```bash
# Asegúrate de estar en el directorio del proyecto
cd gestor-vida

# Agregar todos los archivos al repositorio
git add .

# Commit de los cambios
git commit -m "Preparar para despliegue en Render"

# Push al repositorio remoto
git push origin main
```

### 2. Crear Servicio Web en Render

1. **Inicia sesión en Render**
   - Ve a [render.com](https://render.com)
   - Inicia sesión con tu cuenta

2. **Crear Nuevo Servicio Web**
   - Haz clic en "New +"
   - Selecciona "Web Service"
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket

3. **Configurar el Servicio**
   ```
   Name: gestor-vida
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: gestor-vida
   ```

### 3. Configurar Variables de Entorno

En la sección "Environment Variables" de Render, agrega:

```
NODE_ENV = production
DATABASE_URL = postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
NEXTAUTH_SECRET = [genera una clave secreta segura]
NEXTAUTH_URL = https://tu-app-name.onrender.com
```

### 4. Configurar Comandos de Build y Start

```
Build Command: npm install && npx prisma generate && npx prisma db push
Start Command: npm start
```

### 5. Configurar el Plan

- **Plan**: Free (para empezar)
- **Auto-Deploy**: Yes (para despliegues automáticos)

## 🔄 Proceso de Despliegue

### Comandos que se ejecutarán automáticamente:

1. **Instalación de dependencias**
   ```bash
   npm install
   ```

2. **Generación del cliente Prisma**
   ```bash
   npx prisma generate
   ```

3. **Sincronización de la base de datos**
   ```bash
   npx prisma db push
   ```

4. **Build de la aplicación**
   ```bash
   npm run build
   ```

5. **Inicio del servidor**
   ```bash
   npm start
   ```

## 🌐 Acceso a la Aplicación

Una vez desplegada, tu aplicación estará disponible en:
```
https://tu-app-name.onrender.com
```

## 🔑 Cuentas de Prueba

### Usuario por Defecto:
```
Email: default@gestor-vida.com
Contraseña: password123
```

## 📊 Monitoreo y Logs

- **Logs**: Disponibles en el dashboard de Render
- **Métricas**: CPU, memoria y tiempo de respuesta
- **Estado**: Verificación automática de salud del servicio

## 🔧 Solución de Problemas

### Error de Base de Datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté activa

### Error de Build
- Revisa los logs de build en Render
- Verifica que todas las dependencias estén en `package.json`

### Error de Autenticación
- Verifica que `NEXTAUTH_SECRET` esté configurada
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio

## 🚀 Optimizaciones para Producción

### 1. Configurar Dominio Personalizado (Opcional)
- Ve a "Custom Domains" en Render
- Agrega tu dominio personalizado
- Configura los registros DNS

### 2. Configurar SSL
- Render proporciona SSL automáticamente
- Certificados Let's Encrypt incluidos

### 3. Configurar Variables de Entorno Adicionales
```
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 📈 Escalabilidad

### Planes Disponibles:
- **Free**: Ideal para desarrollo y pruebas
- **Starter**: $7/mes - Para aplicaciones pequeñas
- **Standard**: $25/mes - Para aplicaciones medianas
- **Pro**: $85/mes - Para aplicaciones grandes

## 🔄 Despliegues Automáticos

Con Auto-Deploy habilitado:
- Cada push a la rama `main` activará un nuevo despliegue
- Los despliegues son automáticos y sin tiempo de inactividad
- Rollback disponible en caso de problemas

## 📞 Soporte

- **Documentación**: [render.com/docs](https://render.com/docs)
- **Comunidad**: [render.com/community](https://render.com/community)
- **Soporte**: Disponible en todos los planes

---

## ✅ Checklist de Despliegue

- [ ] Repositorio en GitHub/GitLab/Bitbucket
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas
- [ ] Comandos de build y start configurados
- [ ] Servicio web creado en Render
- [ ] Despliegue exitoso
- [ ] Aplicación accesible en la URL
- [ ] Login funcionando correctamente
- [ ] Todas las funcionalidades operativas

¡Tu Gestor de Vida estará listo para usar en producción! 🎉
