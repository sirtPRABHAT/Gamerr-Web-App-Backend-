import '@babel/polyfill';
import { login, logout, signup } from './login';
import { bookGame } from './stripe';
//import e from 'express';
//import { signup } from '../../controller/authController';

//DOM elements
const signupForm = document.querySelector('#form-signup');
const loginForm = document.querySelector('#form-login');
const logOutBtn = document.querySelector('#logout-btn');
const bookBtn = document.querySelector('#book-game');

//VAlUES

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const user_name = document.getElementById('signup-name').value;
    const user_email = document.getElementById('signup-email').value;
    const user_password = document.getElementById('signup-password').value;
    const user_password_confirm = document.getElementById('signup-passwordConfirm')
      .value;

    signup(user_name, user_email, user_password, user_password_confirm);
  });
}

if (loginForm) {
  console.log('prabhat');
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
