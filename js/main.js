'use strict';

var HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var MAP_WIDTH = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

var element = document.querySelector('.map');
element.classList.remove('map--faded');

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

makeSample(offers(8));
