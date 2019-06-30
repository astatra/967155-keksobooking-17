'use strict';

window.offersCreator = (function () {
  function getOffers(successCallback, errorCallback) {
    window.serverApi.fetchOffers(successCallback, errorCallback);
  }

  function isOfferTypeMatches(item, type) {
    if (type === 'any') {
      return true;
    }

    return item.offer.type === type;
  }

  function filterOffers(offers, filters) {
    return offers.filter(function (item) {
      return isOfferTypeMatches(item, filters.type);
    });
  }

  return {
    getOffers: getOffers,
    filterOffers: filterOffers,
  };
})();

