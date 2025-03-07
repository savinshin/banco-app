import "./style.css";
import accounts from "./accounts.js";
// PUNTO 6: Mostrar fechas con texto del tipo "hace 2 días"
// Implementación: Usamos date-fns en lugar de moment.js para el formato relativo de fechas
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

// Estructura básica de la aplicación
document.querySelector("#app").innerHTML = `
    <nav>
      <p class="welcome">Inicia sesión para comenzar</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login">
        <input type="text" placeholder="usuario" class="login__input login__input--user" />
        <input type="text" placeholder="PIN" maxlength="4" class="login__input login__input--pin" />
        <button class="login__btn">&rarr;</button>
      </form>
    </nav>
    <main class="app">
      <!-- Balance -->
      <div class="balance">
        <div>
          <p class="balance__label">Saldo actual</p>
          <p class="balance__date">
            A fecha de <span class="date">05/03/2037</span>
          </p>
        </div>
        <p class="balance__value">0000€</p>
      </div>
      <!-- Movimientos -->
      <div class="movements">
      </div>
      <!-- Resumen -->
      <div class="summary">
        <p class="summary__label">Ingresos</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Gastos</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interés</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; ORDENAR POR FECHA</button>
      </div>
      <!-- Operación: Transferencias -->
      <div class="operation operation--transfer">
        <h2>Transferir dinero</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transferir a</label>
          <label class="form__label">Cantidad</label>
        </form>
      </div>
      <!-- Operación: Préstamo -->
      <div class="operation operation--loan">
        <h2>Solicitar préstamo</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Cantidad</label>
        </form>
      </div>
      <!-- Operación: Cerrar cuenta -->
      <div class="operation operation--close">
        <h2>Cerrar cuenta</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input type="password" maxlength="6" class="form__input form__input--pin" />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirmar usuario</label>
          <label class="form__label">Confirmar PIN</label>
        </form>
      </div>
      <!-- Temporizador de cierre de sesión -->
      <p class="logout-timer">
        Se cerrará la sesión en <span class="timer">05:00</span>
      </p>
    </main>
`;

// Elementos del DOM
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Función para crear nombres de usuario (iniciales en minúsculas)
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

let currentAccount;

// PUNTO 6: Función para formatear fechas en formato relativo
const formatDate = function(date) {
  const relativeTime = formatDistanceToNow(date, { 
    locale: es,
    addSuffix: true 
  });

  const fullDate = format(date, "d 'de' MMMM 'de' yyyy, HH:mm", {
    locale: es
  });

  const daysDiff = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));
  return daysDiff <= 7 ? relativeTime : fullDate;
};

// PUNTO 7: Poder ordenar el listado de movimientos en función de la fecha
// Implementación: Función para ordenar movimientos ascendente o descendente
const sortMovements = (movements, ascending = false) => {
  return [...movements].sort((a, b) => {
    if (ascending) {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });
};

let isMovementsSorted = false;

// Función para mostrar los movimientos en la UI con fechas relativas
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  
  const movsToDisplay = sort ? sortMovements(account.movements, isMovementsSorted) : account.movements;
  
  movsToDisplay.forEach(function (mov, i) {
    const type = mov.amount > 0 ? 'deposit' : 'withdrawal';
    const formattedDate = formatDate(mov.date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${type === 'deposit' ? 'Depósito' : 'Retiro'}
        </div>
        <div class="movements__date">${formattedDate}</div>
        <div class="movements__value">${mov.amount.toFixed(2)}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Función para actualizar toda la UI
const updateUI = function (account) {
  if (!account) return;
  
  // Mostrar movimientos
  displayMovements(account);
  
  // Mostrar balance
  const balance = account.movements.reduce((acc, mov) => acc + mov.amount, 0);
  labelBalance.textContent = `${balance.toFixed(2)}€`;
  
  // Mostrar resumen
  const incomes = account.movements
    .filter(mov => mov.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  
  const outcomes = account.movements
    .filter(mov => mov.amount < 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  
  const interest = account.movements
    .filter(mov => mov.amount > 0)
    .map(deposit => (deposit.amount * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Event Handlers

// Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  
  // Buscar la cuenta por nombre de usuario
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Verificar PIN
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Mostrar UI y mensaje de bienvenida
    labelWelcome.textContent = `Bienvenido/a, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Limpiar campos de entrada
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Actualizar UI
    updateUI(currentAccount);
  } else {
    alert('Usuario o PIN incorrectos');
  }
});

// PUNTO 2: Se realizan transferencias de dinero de forma satisfactoria
// Implementación: Control completo de transferencias con validaciones
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Validaciones requeridas en el punto 2
  if (amount <= 0) {
    alert('❌ Error: La cantidad debe ser positiva');
    return;
  }

  if (!receiverAcc) {
    alert('❌ Error: La cuenta destino no existe');
    return;
  }

  if (receiverAcc?.username === currentAccount.username) {
    alert('❌ Error: No puedes transferir dinero a tu propia cuenta');
    return;
  }

  const currentBalance = currentAccount.movements.reduce((acc, mov) => acc + mov.amount, 0);
  if (currentBalance < amount) {
    alert(`❌ Error: Saldo insuficiente\nTu saldo actual es: ${currentBalance.toFixed(2)}€`);
    return;
  }

  // PUNTO 4: Implementa los movimientos como objetos con fecha
  currentAccount.movements.push({
    amount: -amount,
    date: new Date()
  });

  receiverAcc.movements.push({
    amount: amount,
    date: new Date()
  });

  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  
  alert(`✅ Transferencia realizada con éxito\n
• Cantidad: ${amount.toFixed(2)}€
• Destinatario: ${receiverAcc.owner}
• Nuevo saldo: ${currentBalance - amount}€`);
});

// PUNTO 3: Se solicita un prestamo y se actualizan los datos en la pantalla
// Implementación: Validación de préstamos con límite del 200%
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));
  const currentBalance = currentAccount.movements.reduce((acc, mov) => acc + mov.amount, 0);
  const maxLoanAmount = currentBalance * 2; // 200% del balance actual

  if (amount <= 0) {
    alert('❌ Error: La cantidad solicitada debe ser positiva');
    return;
  }

  if (amount > maxLoanAmount) {
    alert(`❌ Error: Préstamo denegado\n
• Tu saldo actual: ${currentBalance.toFixed(2)}€
• Préstamo máximo (200%): ${maxLoanAmount.toFixed(2)}€
• Cantidad solicitada: ${amount.toFixed(2)}€`);
    return;
  }

  // PUNTO 4: Movimiento del préstamo como objeto con fecha
  currentAccount.movements.push({
    amount: amount,
    date: new Date()
  });

  updateUI(currentAccount);
  inputLoanAmount.value = '';

  alert(`✅ Préstamo aprobado\n
• Cantidad prestada: ${amount.toFixed(2)}€
• Límite disponible: ${maxLoanAmount.toFixed(2)}€
• Nuevo saldo: ${currentBalance + amount}€`);
});

// PUNTO 1: Implementa la funcionalidad "Close Account"
// Implementación: Eliminar cuenta y prevenir acceso futuro
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    
    // Eliminar la cuenta del array de cuentas
    accounts.splice(index, 1);
    
    // Ocultar UI y mostrar mensaje
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Cuenta cerrada. Inicia sesión con otra cuenta';
    
    alert('✅ Cuenta cerrada correctamente\nTu cuenta ha sido eliminada del sistema.');
  } else {
    alert('❌ Error: Credenciales incorrectas');
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// PUNTO 7: Ordenar movimientos por fecha
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  isMovementsSorted = !isMovementsSorted;
  displayMovements(currentAccount, true);
  
  btnSort.innerHTML = isMovementsSorted 
    ? '&uparrow; ORDENAR POR FECHA' 
    : '&downarrow; ORDENAR POR FECHA';
  
  btnSort.classList.toggle('btn--sort-asc', isMovementsSorted);
  btnSort.classList.toggle('btn--sort-desc', !isMovementsSorted);
});
