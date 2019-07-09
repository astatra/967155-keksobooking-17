'use strict';

window.card = (function () {

  var housingTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  function formatCapacity(offer) {
    return offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  }

  function formatTime(offer) {
    return 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  }

  function renderFeatures(features) {
    var fragment = document.createDocumentFragment();

    features.forEach(function (feature) {
      var item = document.createElement('li');

      item.classList.add('popup__feature');
      item.classList.add('popup__feature--' + feature);

      fragment.appendChild(item);
    });

    return fragment;
  }

  function renderPhotos(imageTmpl, photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      var image = imageTmpl.cloneNode();

      image.src = photo;
      fragment.appendChild(image);
    });

    return fragment;
  }

  function Card(data, onClose) {
    this.data_ = data;
    this.onClose_ = onClose;

    this.onCloseClick_ = this.onCloseClick_.bind(this);
    this.onKeyDown_ = this.onKeyDown_.bind(this);
  }

  Card.prototype.onCloseClick_ = function () {
    this.onClose_(this);
  };

  Card.prototype.onKeyDown_ = function (evt) {
    if (evt.key === 'Escape') {
      this.onClose_(this);
    }
  };

  Card.prototype.destroy = function () {
    this.element_.remove();
    document.removeEventListener('keydown', this.onKeyDown_);
  };

  Card.prototype.render = function () {
    var cardTemplate = document.querySelector('#card');
    var cardSample = cardTemplate.content.querySelector('.map__card').cloneNode(true);
    var featuresContainer = cardSample.querySelector('.popup__features');
    var photosContainer = cardSample.querySelector('.popup__photos');
    var photoTmpl = photosContainer.querySelector('img');

    var offer = this.data_.offer;

    cardSample.querySelector('.popup__title').textContent = offer.title;
    cardSample.querySelector('.popup__text--address').textContent = offer.address;
    cardSample.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    cardSample.querySelector('.popup__type ').textContent = housingTypes[offer.type];
    cardSample.querySelector('.popup__text--capacity').textContent = formatCapacity(offer);
    cardSample.querySelector('.popup__text--time').textContent = formatTime(offer);
    cardSample.querySelector('.popup__description').textContent = offer.description;
    cardSample.querySelector('.popup__avatar ').src = this.data_.author.avatar;

    featuresContainer.innerHTML = '';
    featuresContainer.appendChild(renderFeatures(offer.features));

    photosContainer.innerHTML = '';
    photosContainer.appendChild(renderPhotos(photoTmpl, offer.photos));

    this.element_ = cardSample;

    this.element_.querySelector('.popup__close').addEventListener('click', this.onCloseClick_);
    document.addEventListener('keydown', this.onKeyDown_);

    return cardSample;
  };

  function createCard(data, onClose) {
    return new Card(data, onClose);
  }

  return {
    createCard: createCard,
  };
})();
