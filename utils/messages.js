const createMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date(),
  };
};

const createLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date(),
  };
};

module.exports = {
  createMessage,
  createLocationMessage,
};
