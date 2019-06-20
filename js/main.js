'use strict';

var HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var MAP_WIDTH = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_Y = 130;
var MAX_Y = 630;

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

var isCurrentlyActive = false;

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getInRange(location, minSize, maxSize) {
  if (location > maxSize) {
    location = maxSize;
  }

  if (location < minSize) {
    location = minSize;
  }

  return location;
}

/**
 * @param {number} objectsNumber
 * @return {Description[]}
 */
function getOffers(objectsNumber) {
  var generalArray = [];

  for (var index = 0; index < objectsNumber; index++) {
    var obj = {
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png'
      },
      offer: {
        type: HOUSING[index % HOUSING.length]
      },
      location: {
        x: getRandom(0, MAP_WIDTH),
        y: getRandom(MIN_Y, MAX_Y)
      }
    };

    generalArray.push(obj);
  }

  return generalArray;
}

/**
 * @param {Description[]} objects
 */
function makeSample(objects) {
  var pinTemplate = document.querySelector('#pin');
  var pinSample = pinTemplate.content.querySelector('.map__pin');
  var container = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < objects.length; i++) {
    var wrap = pinSample.cloneNode(true);
    var arrElement = objects[i];

    wrap.style.left = (arrElement.location.x - PIN_WIDTH / 2) + 'px';
    wrap.style.top = (arrElement.location.y - PIN_HEIGHT) + 'px';

    var image = wrap.querySelector('img');

    image.src = arrElement.author.avatar;
    image.alt = arrElement.offer.type;

    fragment.appendChild(wrap);
  }

  container.appendChild(fragment);
}


/**
 * @param {boolean} isActive
 */
function togglePage(isActive) {
  var mapImage = document.querySelector('.map');
  var form = document.querySelector('.ad-form');
  var formElements = form.querySelectorAll('fieldset');

  mapImage.classList.toggle('map--faded', !isActive);
  form.classList.toggle('ad-form--disabled', !isActive);

  Array.from(formElements).forEach(function (element) {
    element.disabled = !isActive;
  });
}

var pinMain = document.querySelector('.map__pin--main');

function activatePage() {
  if (!isCurrentlyActive) {
    togglePage(true);
    makeSample(getOffers(8));

    isCurrentlyActive = true;
  }
}

togglePage(false);
setAddressFromPin(pinMain);

/**
 * @param {HTMLElement} pin
 * @return {[number, number]}
 */
function getPinLocation(pin) {
  var leftLocation = parseInt(pin.style.left, 10) + pin.clientWidth / 2;
  var topLocation = parseInt(pin.style.top, 10) + pin.clientHeight;

  return [leftLocation, topLocation];
}
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

/**
 * @param {HTMLElement} pin
 */
function setAddressFromPin(pin) {
  var resultLocation = getPinLocation(pin);

  setAddress(resultLocation[0], resultLocation[1]);
}

function getHousePrice() {
  var housingType = document.querySelector('#type');

  return offerTypes[housingType.value].minPrice;
}

function setPrice() {
  var priceHolder = document.querySelector('#price');
  var minPrice = getHousePrice();

  priceHolder.setAttribute('placeholder', minPrice);
  priceHolder.setAttribute('min', minPrice);
}

setPrice();

var housingType = document.querySelector('#type');
housingType.addEventListener('change', function () {
  setPrice();
});

var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');

timeOut.addEventListener('change', function () {
  timeIn.value = timeOut.value;
});

timeIn.addEventListener('change', function () {
  timeOut.value = timeIn.value;
});

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

var form = document.querySelector('.ad-form');

form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  if (form.checkValidity() === true) {
    showSuccess();
  } else {
    showError();
  }
});

var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var isDown = false;
var startCoords;
var offset;

mainPin.addEventListener('mousedown', function (evt) {
  var containerBCR = map.getBoundingClientRect();
  var pinBCR = mainPin.getBoundingClientRect();

  offset = {
    left: pinBCR.left - containerBCR.left,
    top: pinBCR.top - containerBCR.top
  };

  startCoords = {
    left: evt.clientX,
    top: evt.clientY,
  };

  isDown = true;
});

document.addEventListener('mousemove', function (evt) {
  if (isDown) {
    var clientX = offset.left + evt.clientX - startCoords.left;
    var clientY = offset.top + evt.clientY - startCoords.top;

    clientX = getInRange(clientX, 0, map.clientWidth - mainPin.clientWidth);
    clientY = getInRange(clientY, MIN_Y, MAX_Y);

    mainPin.style.left = clientX + 'px';
    mainPin.style.top = clientY + 'px';
    activatePage();
    setAddressFromPin(mainPin);
  }
});

document.addEventListener('mouseup', function () {
  if (isDown) {
    activatePage();
  }

  isDown = false;
});

/**
 * @typedef {Object} Description
 * @prop {Author} author
 * @prop {Offer} offer
 * @prop {DescriptionLocation} location
 */

/**
 * @typedef {Object} Author
 * @prop {string} avatar
 */

/**
 * @typedef {Object} Offer
 * @prop {string} type
 */

/**
 * @typedef {Object} DescriptionLocation
 * @prop {number} x
 * @prop {number} y
 */
