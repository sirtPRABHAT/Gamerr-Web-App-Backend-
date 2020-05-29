import '@babel/polyfill';
import { login, logout } from './login';

//DOM elements
const loginForm = document.querySelector('#form-login');
const logOutBtn = document.querySelector('#logout-btn');

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
