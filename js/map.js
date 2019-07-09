'use strict';

(function () {
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MAX_DISPLAYED_OFFERS = 5;
  var isCurrentlyActive = false;
  var isDown = false;
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var housingTypeFilter = document.querySelector('#housing-type');
  var startCoords;
  var offset;
  var offersData;
  var openedCard = null;

  function getInRange(location, minSize, maxSize) {
    if (location > maxSize) {
      location = maxSize;
    }

    if (location < minSize) {
      location = minSize;
    }

    return location;
  }

  function onPinClick(offerData) {
    showCard(offerData);
  }

  function renderSamples(objects) {
    var container = document.querySelector('.map__pins');

    objects.forEach(function (item) {
      var pin = window.pinCreator.createPin(item, onPinClick);

      container.appendChild(pin.render());
    });
  }

  function clearSamples() {
    var container = document.querySelector('.map__pins');

    window.pinCreator.clearPins(container);
  }

  /**
   * @param {boolean} isActive
   */
  function togglePage(isActive) {
    map.classList.toggle('map--faded', !isActive);

    window.bookingForm.toggleForm(isActive);
  }

  function closeCard() {
    if (openedCard) {
      openedCard.destroy();

      openedCard = null;
    }
  }

  function showCard(offer) {
    var cardElement = window.card.createCard(offer, closeCard);
    var filters = map.querySelector('.map__filters-container');

    closeCard();

    openedCard = cardElement;

    map.insertBefore(cardElement.render(), filters);
  }

  function activatePage() {
    if (!isCurrentlyActive) {
      togglePage(true);

      window.offersCreator.getOffers(function (data) {
        offersData = data;

        applyFilters();
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

  function getCurrentFilters() {
    return {
      type: housingTypeFilter.value,
    };
  }

  function applyFilters() {
    var currentFilters = getCurrentFilters();
    var filteredOffers = window.offersCreator.filterOffers(offersData, currentFilters);

    clearSamples();
    renderSamples(filteredOffers.slice(0, MAX_DISPLAYED_OFFERS));
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

  housingTypeFilter.addEventListener('change', applyFilters);

  togglePage(false);
  setAddressFromPin(mainPin);
})();

