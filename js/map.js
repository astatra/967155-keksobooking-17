'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var isCurrentlyActive = false;
  var isDown = false;
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var startCoords;
  var offset;

  function getInRange(location, minSize, maxSize) {
    if (location > maxSize) {
      location = maxSize;
    }

    if (location < minSize) {
      location = minSize;
    }

    return location;
  }

  function renderSamples(objects) {
    var container = document.querySelector('.map__pins');

    container.appendChild(window.pinCreator.makeSamples(objects));
  }

  /**
   * @param {boolean} isActive
   */
  function togglePage(isActive) {
    var mapImage = document.querySelector('.map');
    mapImage.classList.toggle('map--faded', !isActive);

    window.bookingForm.toggleForm(isActive);
  }

  function activatePage() {
    if (!isCurrentlyActive) {
      togglePage(true);

      window.offersCreator.getOffers(function (data) {
        renderSamples(data);
      }, function () {
        window.errorMsg.show();
      });

      isCurrentlyActive = true;
    }
  }

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
   * @param {HTMLElement} pin
   */
  function setAddressFromPin(pin) {
    var resultLocation = getPinLocation(pin);

    window.bookingForm.setAddress(resultLocation[0], resultLocation[1]);
  }

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

  togglePage(false);
  setAddressFromPin(mainPin);
})();

