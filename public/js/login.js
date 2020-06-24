import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:2000/api/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'Success') {
      showAlert('success', 'Logged In Successfully');
      // NOTE how to set timeout in js
      window.setTimeout(() => {
        // NOTE location.assign for loading specified page
        // NOTE similarly location.reload(true/false) for reloading true-reloadig from serverData, false-reloading from cache data
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:2000/api/users/logout',
    });
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'error loggingOut! Try again');
  }
};
