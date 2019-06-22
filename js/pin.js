'use strict';

window.pinCreator = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  function makeSamples(objects) {
    var pinTemplate = document.querySelector('#pin');
    var pinSample = pinTemplate.content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < objects.length; i++) {
      var wrap = fillPlaceholder(pinSample, objects[i]);

      fragment.appendChild(wrap);
    }

    return fragment;
  }

  function fillPlaceholder(element, data) {
    var wrap = element.cloneNode(true);
    var image = wrap.querySelector('img');

    wrap.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
    wrap.style.top = (data.location.y - PIN_HEIGHT) + 'px';

    image.src = data.author.avatar;
    image.alt = data.offer.type;

    return wrap;
  }

  return {
    makeSamples: makeSamples
  };
})();
