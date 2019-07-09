'use strict';

window.pinCreator = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  function Pin(data, callback) {
    this.data_ = data;
    this.callback_ = callback;

    this.onPinClick_ = this.onPinClick_.bind(this);
  }

  Pin.prototype.onPinClick_ = function () {
    this.callback_(this.data_);
  };

  Pin.prototype.render = function () {
    var pinTemplate = document.querySelector('#pin');
    var pinSample = pinTemplate.content.querySelector('.map__pin');
    var wrap = fillPlaceholder(pinSample, this.data_);

    this.element_ = wrap;

    this.element_.addEventListener('click', this.onPinClick_);

    return wrap;
  };

  function fillPlaceholder(element, data) {
    var wrap = element.cloneNode(true);
    var image = wrap.querySelector('img');

    wrap.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
    wrap.style.top = (data.location.y - PIN_HEIGHT) + 'px';

    image.src = data.author.avatar;
    image.alt = data.offer.type;

    return wrap;
  }

  function createPin(data, callback) {
    return new Pin(data, callback);
  }

  function clearPins(container) {
    var pins = container.querySelectorAll('.map__pin:not(.map__pin--main)');

    Array.from(pins).forEach(function (pin) {
      pin.remove();
    });
  }

  return {
    createPin: createPin,
    clearPins: clearPins,
  };
})();
