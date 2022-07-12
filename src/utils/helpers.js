// const config = require('../config');

const getFileName = (file = '', extention = 'js') => {
  return file.match(new RegExp(`[^/]*.${extention}$`, 'i'))[0];
};

function updateImageUrl(key) {
  const value = this.getDataValue(key);

  if (!value) {
    return null;
  }

  return `localhost:3008${value}`;
  // return `${config.urls.current}${value}`;
}

module.exports = {
  getFileName,
  updateImageUrl,
};
