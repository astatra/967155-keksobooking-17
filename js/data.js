'use strict';

window.offersCreator = (function () {
  function getOffers(successCallback, errorCallback) {
    window.serverApi.fetchOffers(successCallback, errorCallback);
  }

  return {
    getOffers: getOffers,
  };
})();

