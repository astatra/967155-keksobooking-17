'use strict';

var HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var MAP_WIDTH = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var isCurrentlyActive = false;

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} objectsNumber
 * @return {Description[]}
 */
function offers(objectsNumber) {
  var generalArray = [];
  var minY = 130;
  var maxY = 630;

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
        y: getRandom(minY, maxY)
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

pinMain.addEventListener('click', function () {
  if (!isCurrentlyActive) {
    togglePage(true);
    makeSample(offers(8));

    isCurrentlyActive = true;
  }
});

pinMain.addEventListener('mouseup', function (evt) {
  setAddressFromPin(evt.currentTarget);
});

togglePage(false);
setAddressFromPin(pinMain);

/**
 * @param {HTMLElement} pin
 * @return {[number, number]}
 */
function getPinsLocation(pin) {
  var leftLocation = parseInt(pin.style.left, 10) + PIN_WIDTH / 2;
  var topLocation = parseInt(pin.style.top, 10) + PIN_HEIGHT;

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
  var resultLocation = getPinsLocation(pin);

  setAddress(resultLocation[0], resultLocation[1]);
}

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
