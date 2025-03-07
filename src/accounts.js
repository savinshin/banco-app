import { generateRandomAccounts } from './generateFakeData.js';

// Generar cuentas aleatorias
const accounts = generateRandomAccounts();

// Mostrar información de las cuentas generadas en la consola para facilitar pruebas
console.log('Cuentas generadas:');
accounts.forEach(account => {
  console.log(`Usuario: ${account.owner}`);
  console.log(`PIN: ${account.pin}`);
  console.log('------------------------');
});

export default accounts;