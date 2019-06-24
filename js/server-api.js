'use strict';

window.serverApi = (function () {
  function fetchOffers(successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        var dataArr = JSON.parse(xhr.responseText);
        successCallback(dataArr);
      } else {
        errorCallback();
      }
    });

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  }

  return {
    fetchOffers: fetchOffers
  };
})();
