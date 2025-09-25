# 🔧 Configuración Específica para Render

## 📋 Variables de Entorno Requeridas

Configura estas variables en el dashboard de Render:

### Variables Obligatorias:
```
NODE_ENV = production
DATABASE_URL = postgresql://ergdatabase_user:TmrDZN7K9OdEUXYbPxwm2RVcFJi2FZ5u@dpg-d39imp8dl3ps73a9c3p0-a.oregon-postgres.render.com/ergdatabase
NEXTAUTH_SECRET = [genera una clave secreta segura]
NEXTAUTH_URL = https://tu-app-name.onrender.com
```

### Variables Opcionales:
```
NEXT_TELEMETRY_DISABLED = 1
```

## 🚀 Comandos de Build y Start

### Build Command:
```bash
npm install && npx prisma generate && npx prisma db push
```

### Start Command:
```bash
npm start
```

## 📁 Estructura del Proyecto

```
gestor-vida/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   └── ...
│   ├── components/
│   └── lib/
├── prisma/
│   └── schema.prisma
├── package.json
├── next.config.ts
├── render.yaml
└── DEPLOYMENT.md
```

## 🔄 Proceso de Despliegue Automático

1. **Instalación de dependencias**
   - Render ejecuta `npm install`

2. **Generación del cliente Prisma**
   - Render ejecuta `npx prisma generate`

3. **Sincronización de la base de datos**
   - Render ejecuta `npx prisma db push`

4. **Build de la aplicación**
   - Render ejecuta `npm run build`

5. **Inicio del servidor**
   - Render ejecuta `npm start`

## 🌐 Configuración de Dominio

### Dominio por Defecto:
```
https://tu-app-name.onrender.com
```

### Dominio Personalizado (Opcional):
1. Ve a "Custom Domains" en Render
2. Agrega tu dominio
3. Configura los registros DNS
4. Actualiza `NEXTAUTH_URL` con tu dominio

## 📊 Monitoreo y Logs

### Logs Disponibles:
- Build logs
- Runtime logs
- Error logs
- Access logs

### Métricas:
- CPU usage
- Memory usage
- Response time
- Request count

## 🔧 Solución de Problemas

### Error de Build:
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build
- Asegúrate de que Node.js esté configurado correctamente

### Error de Base de Datos:
- Verifica que `DATABASE_URL` esté configurada
- Asegúrate de que la base de datos esté activa
- Revisa los logs de Prisma

### Error de Autenticación:
- Verifica que `NEXTAUTH_SECRET` esté configurada
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio
- Revisa los logs de NextAuth

## 🚀 Optimizaciones

### Para Mejor Rendimiento:
1. **Habilitar compresión**
   - Configurar middleware de compresión
   
2. **Optimizar imágenes**
   - Usar Next.js Image Optimization
   
3. **Configurar caché**
   - Headers de caché apropiados

### Para Escalabilidad:
1. **Plan Starter** ($7/mes)
   - Mejor rendimiento
   - Más recursos
   
2. **Plan Standard** ($25/mes)
   - Escalabilidad automática
   - Mejor disponibilidad

## 📞 Soporte

- **Documentación**: [render.com/docs](https://render.com/docs)
- **Comunidad**: [render.com/community](https://render.com/community)
- **Soporte**: Disponible en todos los planes

---

## ✅ Checklist de Configuración

- [ ] Variables de entorno configuradas
- [ ] Comandos de build y start configurados
- [ ] Base de datos conectada
- [ ] Dominio configurado
- [ ] SSL habilitado
- [ ] Monitoreo configurado
- [ ] Logs habilitados
- [ ] Despliegue automático habilitado

¡Tu aplicación estará lista para producción! 🎉
