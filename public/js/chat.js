var socket = io();

const $messageForm = document.querySelector('#msg-form');
const $messageInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('message', (msg) => {
  console.log(msg);
});

socket.on('new-msg', (message) => {
  console.log(message);
});

$messageForm.addEventListener('submit', (event) => {
  //disabling send message
  event.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');
  const message = event.target.msg.value;
  socket.emit('send-msg', message, (error) => {
    //error argument is passed from server side, where it is called
    //enabling send message
    $messageFormButton.removeAttribute('disabled');
    $messageInput.value = '';
    $messageInput.focus();

    if (error) {
      console.log(error);
    }
    console.log('Message delieverd');
  });
});

$sendLocationButton.addEventListener('click', (event) => {
  $sendLocationButton.setAttribute('disabled', 'disabled');
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      },
      (successMessage) => {
        $sendLocationButton.removeAttribute('disabled');
        console.log(successMessage);
      }
    );
  });
});
