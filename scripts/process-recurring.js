#!/usr/bin/env node

/**
 * Script para procesar transacciones recurrentes
 * Este script debe ejecutarse diariamente via cron job
 * 
 * Para configurar el cron job, ejecuta:
 * crontab -e
 * 
 * Y agrega esta línea para ejecutar diariamente a las 6:00 AM:
 * 0 6 * * * cd /ruta/a/tu/proyecto && node scripts/process-recurring.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ENDPOINT = '/api/cron/process-recurring';

async function processRecurringTransactions() {
  return new Promise((resolve, reject) => {
    const url = new URL(ENDPOINT, BASE_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`Error parsing response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function main() {
  try {
    console.log(`[${new Date().toISOString()}] Starting recurring transactions processing...`);
    
    const result = await processRecurringTransactions();
    
    console.log(`[${new Date().toISOString()}] Processing completed:`);
    console.log(`- Message: ${result.message}`);
    console.log(`- Processed: ${result.processed?.length || 0} transactions`);
    
    if (result.processed && result.processed.length > 0) {
      console.log('Processed transactions:');
      result.processed.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.recurring.name} - $${item.transaction.amount}`);
      });
    }
    
    console.log(`[${new Date().toISOString()}] Script completed successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { processRecurringTransactions };
