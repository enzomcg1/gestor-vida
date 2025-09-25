# Transacciones Recurrentes - Gestor de Vida

## Descripción

Las transacciones recurrentes permiten automatizar el registro de ingresos y gastos que se repiten periódicamente, como salarios, rentas, suscripciones, etc.

## Características

### Tipos de Frecuencia
- **Mensual**: Se procesa el mismo día cada mes
- **Semanal**: Se procesa cada 7 días
- **Anual**: Se procesa el mismo día cada año

### Funcionalidades
- ✅ Crear transacciones recurrentes
- ✅ Activar/desactivar transacciones
- ✅ Procesamiento automático
- ✅ Historial de transacciones generadas
- ✅ Gestión desde la interfaz web

## Uso

### 1. Crear una Transacción Recurrente

1. Ve a la sección **Finanzas**
2. Haz clic en la pestaña **Recurrentes**
3. Haz clic en **Nueva Recurrente**
4. Completa el formulario:
   - **Nombre**: Ej. "Salario mensual"
   - **Tipo**: Ingreso o Gasto
   - **Categoría**: Selecciona una categoría
   - **Frecuencia**: Mensual, Semanal o Anual
   - **Monto**: Cantidad fija
   - **Día del mes**: Solo para frecuencia mensual (1-31)

### 2. Procesar Transacciones Recurrentes

#### Opción A: Manual
1. En la sección Finanzas, haz clic en **Procesar Recurrentes**
2. El sistema creará automáticamente las transacciones que correspondan

#### Opción B: Automático (Recomendado)
Configura un cron job para procesar automáticamente:

```bash
# Editar crontab
crontab -e

# Agregar esta línea para ejecutar diariamente a las 6:00 AM
0 6 * * * cd /ruta/a/tu/proyecto && node scripts/process-recurring.js
```

### 3. API Endpoints

#### Procesar Transacciones Recurrentes
```bash
# Manual
curl -X POST http://localhost:3000/api/recurring-transactions/process

# Cron job
curl -X GET http://localhost:3000/api/cron/process-recurring
```

#### Gestión de Transacciones Recurrentes
```bash
# Obtener todas las recurrentes
GET /api/recurring-transactions

# Crear nueva recurrente
POST /api/recurring-transactions
{
  "name": "Salario mensual",
  "type": "INCOME",
  "categoryId": "category-id",
  "frequency": "MONTHLY",
  "dayOfMonth": 1,
  "amount": 5000
}

# Actualizar recurrente
PATCH /api/recurring-transactions/[id]

# Eliminar recurrente
DELETE /api/recurring-transactions/[id]
```

## Configuración del Entorno

### Variables de Entorno
```env
# URL base para el procesamiento automático
BASE_URL=http://localhost:3000
```

### Script de Procesamiento
El script `scripts/process-recurring.js` puede ejecutarse:
- Manualmente: `node scripts/process-recurring.js`
- Via cron job (recomendado)
- Via servicios como PM2 con cron

## Ejemplos de Uso

### Salario Mensual
```json
{
  "name": "Salario mensual",
  "type": "INCOME",
  "categoryId": "salary-category-id",
  "frequency": "MONTHLY",
  "dayOfMonth": 1,
  "amount": 5000,
  "description": "Salario base mensual"
}
```

### Renta Mensual
```json
{
  "name": "Renta departamento",
  "type": "EXPENSE",
  "categoryId": "housing-category-id",
  "frequency": "MONTHLY",
  "dayOfMonth": 5,
  "amount": 1200,
  "description": "Renta mensual del departamento"
}
```

### Suscripción Anual
```json
{
  "name": "Netflix anual",
  "type": "EXPENSE",
  "categoryId": "entertainment-category-id",
  "frequency": "YEARLY",
  "amount": 180,
  "description": "Suscripción anual de Netflix"
}
```

## Notas Importantes

1. **Procesamiento Mensual**: Para transacciones mensuales, el sistema verifica que no se haya procesado ya en el mes actual
2. **Fechas**: Las transacciones se crean con la fecha actual del procesamiento
3. **Categorías**: Las transacciones recurrentes deben tener una categoría válida
4. **Estado**: Las transacciones pueden activarse/desactivarse sin eliminarlas

## Troubleshooting

### El procesamiento no funciona
1. Verifica que la base de datos esté conectada
2. Revisa los logs del servidor
3. Asegúrate de que las categorías existan

### Las transacciones no se crean
1. Verifica que la transacción recurrente esté activa
2. Revisa la fecha de próximo vencimiento
3. Confirma que no se haya procesado ya en el período actual

### Error en el cron job
1. Verifica la ruta del proyecto
2. Asegúrate de que Node.js esté en el PATH
3. Revisa los permisos del archivo de script
