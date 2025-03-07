// PUNTO 5: Generar datos aleatorios vía https://fakerjs.dev/
// Implementación: Utilizamos faker.js para generar datos realistas de usuarios y movimientos
import { faker } from '@faker-js/faker/locale/es';

// PUNTO 4: Implementa los movimientos como objetos que llevan además del importe la fecha
// Implementación: Cada movimiento es un objeto con amount y date
const generateRandomMovement = (date) => {
  // Decidimos aleatoriamente si será un depósito o retiro
  const isDeposit = faker.datatype.boolean();
  
  // Generamos un monto aleatorio: positivo para depósitos, negativo para retiros
  const amount = isDeposit 
    ? faker.number.int({ min: 100, max: 5000, precision: 0.01 })  // Depósitos entre 100€ y 5000€
    : -faker.number.int({ min: 50, max: 2000, precision: 0.01 }); // Retiros entre 50€ y 2000€
  
  // Creamos el objeto movimiento con monto y fecha
  return {
    amount,
    // Generamos una fecha aleatoria en los últimos 30 días
    date: faker.date.between({ 
      from: date.setDate(date.getDate() - 30),
      to: new Date() 
    })
  };
};

// Función para generar cuentas aleatorias con datos realistas
const generateRandomAccount = () => {
  // Generamos nombre y apellido aleatorio
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const owner = `${firstName} ${lastName}`;
  
  // Generamos entre 5 y 12 movimientos aleatorios
  const numMovements = faker.number.int({ min: 5, max: 12 });
  const movements = Array.from({ length: numMovements }, () => 
    generateRandomMovement(new Date())
  ).sort((a, b) => a.date - b.date); // Ordenamos por fecha

  // Retornamos la cuenta completa
  return {
    owner,
    movements,
    interestRate: faker.number.int({ min: 0.5, max: 2.5, precision: 0.1 }), // Tasa de interés entre 0.5% y 2.5%
    pin: faker.number.int({ min: 1000, max: 9999 }) // PIN de 4 dígitos
  };
};

// Generar conjunto de cuentas para la aplicación
const generateRandomAccounts = () => {
  // Generamos entre 4 y 8 cuentas
  const numAccounts = faker.number.int({ min: 4, max: 8 });
  return Array.from({ length: numAccounts }, generateRandomAccount);
};

export { generateRandomAccounts, generateRandomAccount, generateRandomMovement };
