'use strict';

window.bookingForm = (function () {
  var offerTypes = {
    bungalo: {
      minPrice: 0,
    },
    flat: {
      minPrice: 1000,
    },
    house: {
      minPrice: 5000,
    },
    palace: {
      minPrice: 10000,
    }
  };
  var form = document.querySelector('.ad-form');
  var housingType = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');

  /**
   * @param {number} x
   * @param {number} y
   */
  function setAddress(x, y) {
    var address = /** @type {HTMLInputElement} */ (
      document.querySelector('#address')
    );

    address.value = x + ',' + y;
  }

  function getHousePrice() {
    return offerTypes[housingType.value].minPrice;
  }

  function setPrice() {
    var priceHolder = document.querySelector('#price');
    var minPrice = getHousePrice();

    priceHolder.setAttribute('placeholder', minPrice);
    priceHolder.setAttribute('min', minPrice);
  }

  function showSuccess() {
    var successTemplate = document.querySelector('#success');
    var successWindow = successTemplate.content.querySelector('.success');
    var body = document.body;
    var wrap = successWindow.cloneNode(true);

    function addKeyDownListener(evt) {
      if (evt.keyCode === 27) {
        hideSuccessMsg();
      }
    }

    function addEscapeClick() {
      hideSuccessMsg();
    }

    function hideSuccessMsg() {
      body.removeChild(wrap);
      document.removeEventListener('keydown', addKeyDownListener);
      document.removeEventListener('click', addEscapeClick);
      form.reset();
    }

    document.addEventListener('keydown', addKeyDownListener);
    document.addEventListener('click', addEscapeClick);

    body.appendChild(wrap);
  }

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

  function toggleForm(isActive) {
    var formElements = form.querySelectorAll('fieldset');

    form.classList.toggle('ad-form--disabled', !isActive);

    Array.from(formElements).forEach(function (element) {
      element.disabled = !isActive;
    });
  }

  housingType.addEventListener('change', function () {
    setPrice();
  });

  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    if (form.checkValidity() === true) {
      showSuccess();
    } else {
      showError();
    }
  });

  setPrice();

  return {
    toggleForm: toggleForm,
    setAddress: setAddress
  };
})();
