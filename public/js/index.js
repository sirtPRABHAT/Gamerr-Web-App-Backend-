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
    console.log(email, password);
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
    // gameId = event.target.dataset.gameId;
    bookGame('5ed153dbc9cb2939d0939ed9');
  });
}
