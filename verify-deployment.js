#!/usr/bin/env node

/**
 * Script de verificación para despliegue en Render
 * Verifica que todos los archivos y configuraciones estén correctos
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Archivo no encontrado: ${filePath}`, 'red');
    return false;
  }
}

function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verificar scripts requeridos
    const requiredScripts = ['dev', 'build', 'start'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length === 0) {
      log('✅ Scripts de package.json correctos', 'green');
      return true;
    } else {
      log(`❌ Scripts faltantes en package.json: ${missingScripts.join(', ')}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error al leer package.json: ${error.message}`, 'red');
    return false;
  }
}

function checkPrismaSchema() {
  try {
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
    
    // Verificar que contenga los modelos principales
    const requiredModels = ['User', 'Task', 'Routine', 'Transaction', 'SavingsGoal'];
    const missingModels = requiredModels.filter(model => !schema.includes(`model ${model}`));
    
    if (missingModels.length === 0) {
      log('✅ Esquema de Prisma correcto', 'green');
      return true;
    } else {
      log(`❌ Modelos faltantes en Prisma: ${missingModels.join(', ')}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Error al leer prisma/schema.prisma: ${error.message}`, 'red');
    return false;
  }
}

function checkEnvironmentFiles() {
  const envFiles = ['.env', '.env.local', '.env.production'];
  const existingEnvFiles = envFiles.filter(file => fs.existsSync(file));
  
  if (existingEnvFiles.length > 0) {
    log(`✅ Archivos de entorno encontrados: ${existingEnvFiles.join(', ')}`, 'green');
    return true;
  } else {
    log('⚠️  No se encontraron archivos de entorno (esto es normal para producción)', 'yellow');
    return true;
  }
}

function checkNextConfig() {
  if (fs.existsSync('next.config.ts') || fs.existsSync('next.config.js')) {
    log('✅ Configuración de Next.js encontrada', 'green');
    return true;
  } else {
    log('⚠️  No se encontró next.config.ts/js (opcional)', 'yellow');
    return true;
  }
}

function checkGitIgnore() {
  if (fs.existsSync('.gitignore')) {
    log('✅ Archivo .gitignore encontrado', 'green');
    return true;
  } else {
    log('⚠️  No se encontró .gitignore (recomendado)', 'yellow');
    return true;
  }
}

function main() {
  log('\n🚀 Verificando configuración para despliegue en Render...\n', 'bold');
  
  const checks = [
    { name: 'package.json', fn: checkPackageJson },
    { name: 'Prisma Schema', fn: checkPrismaSchema },
    { name: 'Archivos de entorno', fn: checkEnvironmentFiles },
    { name: 'Configuración Next.js', fn: checkNextConfig },
    { name: 'Archivo .gitignore', fn: checkGitIgnore },
    { name: 'src/app/layout.tsx', fn: () => checkFile('src/app/layout.tsx', 'Layout principal') },
    { name: 'src/lib/prisma.ts', fn: () => checkFile('src/lib/prisma.ts', 'Cliente de Prisma') },
    { name: 'src/lib/auth.ts', fn: () => checkFile('src/lib/auth.ts', 'Configuración de autenticación') },
    { name: 'middleware.ts', fn: () => checkFile('middleware.ts', 'Middleware de autenticación') },
    { name: 'render.yaml', fn: () => checkFile('render.yaml', 'Configuración de Render') },
    { name: 'README.md', fn: () => checkFile('README.md', 'Documentación') },
    { name: 'DEPLOY_TO_RENDER.md', fn: () => checkFile('DEPLOY_TO_RENDER.md', 'Guía de despliegue') }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  checks.forEach(check => {
    if (check.fn()) {
      passed++;
    }
  });
  
  log(`\n📊 Resultado: ${passed}/${total} verificaciones pasaron\n`, 'bold');
  
  if (passed === total) {
    log('🎉 ¡Todo está listo para el despliegue en Render!', 'green');
    log('\n📋 Próximos pasos:', 'blue');
    log('1. Sube tu código a GitHub/GitLab/Bitbucket');
    log('2. Crea un servicio web en Render');
    log('3. Configura las variables de entorno');
    log('4. Configura los comandos de build y start');
    log('5. ¡Despliega!');
    log('\n📖 Para más detalles, consulta DEPLOY_TO_RENDER.md', 'blue');
  } else {
    log('⚠️  Algunas verificaciones fallaron. Revisa los errores arriba.', 'yellow');
    log('💡 Asegúrate de que todos los archivos estén presentes antes del despliegue.', 'yellow');
  }
  
  log('\n', 'reset');
}

main();
