#!/usr/bin/env node

/**
 * SUPER COMANDO SIMPLIFICADO PARA EXPORTAÇÃO
 * 
 * Uso:
 * node export.mjs          -> Exporta TODOS os projetos
 * node export.mjs cv       -> Exporta apenas o CV
 * node export.mjs motd     -> Exporta apenas o MOTD  
 * node export.mjs ecom     -> Exporta apenas o E-commerce
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const APPS = {
  cv: 'cv',
  motd: 'motd', 
  ecom: 'ecommerce',
  ecommerce: 'ecommerce'
};

async function main() {
  const arg = process.argv[2];
  
  if (!arg) {
    // Exportar todos
    console.log('🚀 Exportando TODOS os projetos...');
    await execAsync('node ./scripts/export-app-graph.mjs --all');
  } else if (APPS[arg]) {
    // Exportar projeto específico
    console.log(`📦 Exportando ${arg}...`);
    await execAsync(`node ./scripts/export-app-graph.mjs --app=${APPS[arg]} --zip`);
  } else {
    console.log(`
❌ App '${arg}' não encontrado!

💡 USO:
  node export.mjs          -> Exporta TODOS
  node export.mjs cv       -> Exporta CV
  node export.mjs motd     -> Exporta MOTD
  node export.mjs ecom     -> Exporta E-commerce

✨ Arquivos ZIP criados em: exports/
`);
    process.exit(1);
  }
  
  console.log('✅ Exportação concluída!');
}

main().catch(console.error);
