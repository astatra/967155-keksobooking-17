'use strict';

window.errorMsg = (function () {
  function showError() {
    var errorTemplate = document.querySelector('#error');
    var errorWindow = errorTemplate.content.querySelector('.error');
    var body = document.body;
    var wrap = errorWindow.cloneNode(true);
    var buttonAgain = wrap.querySelector('.error__button');

    buttonAgain.addEventListener('click', function () {
      body.removeChild(wrap);
    });

    body.appendChild(wrap);
  }

  return {
    show: showError
  };
})();
