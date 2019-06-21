'use strict';

window.offersCreator = (function () {
  var HOUSING = ['palace', 'flat', 'house', 'bungalo'];
  var MAP_WIDTH = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;

  /**
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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

  return {
    getOffers: getOffers,
  };
})();

