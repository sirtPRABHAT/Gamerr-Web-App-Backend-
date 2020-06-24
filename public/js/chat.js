var socket = io();

const $messageForm = document.querySelector('#msg-form');
const $messageInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template')
  .innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//parsing url for retrieving query
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    timestamp: moment(msg.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (locationObj) => {
  console.log(locationObj);
  const html = Mustache.render(locationTemplate, {
    username: locationObj.username,
    url: locationObj.url,
    timestamp: moment(locationObj.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
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

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href('/');
  }
});
