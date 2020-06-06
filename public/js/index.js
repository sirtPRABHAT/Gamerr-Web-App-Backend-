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
    event.preventDefault();
    const gameId = event.target.getAttribute('data-id');
    event.target.innerHTML = 'Process..';
    bookGame(gameId, event);
  });
}

//- var x = setInterval(function () { var now = new Date().getTime(); var distance = countDownDate - now; var days = Math.floor(distance / (1000 * 60 * 60 * 24)); var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
// document.getElementById('timer').innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's '; if (distance < 0) { clearInterval(x); document.getElementById('timer').innerHTML = 'TOURNAMENT ENDED'; document.getElementById('purchase').setAttribute('href', '#');}},1000)
