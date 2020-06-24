import '@babel/polyfill';
import { login, logout } from './login';
import { bookGame } from './stripe';

//DOM elements
const loginForm = document.querySelector('#form-login');
const logOutBtn = document.querySelector('#logout-btn');
const bookBtn = document.querySelector('#book-game');

//VAlUES

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', (event) => {
    logout();
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const gameId = event.target.getAttribute('data-id');
    event.target.innerHTML = 'Process..';
    bookGame(gameId, event);
  });
}
