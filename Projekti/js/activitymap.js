'use strict';

// Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//ikonit
const punainenIkoni = L.divIcon({className: 'punainen-ikoni'});
const vihreaIkoni = L.divIcon({className: 'vihrea-ikoni'});

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  const crd = pos.coords;
  map.setView([crd.latitude, crd.longitude], 13);

  const omaPaikka = LisaaMarker(crd, 'Olen tässä', punainenIkoni);
  omaPaikka.openPopup();

  haeLatauspisteet(crd).then(function(eventit) {
    for (let i = 0; i < eventit.length; i++) {
      const teksti = eventit[i].id;
      const koordinaatit = {
        latitude: eventit[i].Coordinates.latitude,
        longitude: eventit[i].Coordinates.longitude,
      };
      const markkeri = LisaaMarker(koordinaatit, teksti, vihreaIkoni);
      markkeri.on('click', function() {
        document.querySelector(
            '#name').innerHTML = eventit[i].Name.fi;
        document.querySelector(
            '#address').innerHTML = eventit[i].Address.streetAddress;
        document.querySelector(
            '#whereWhenDuration').innerHTML = eventit[i].WhereWhenDurationTranslated.whereAndWhen;
        document.querySelector(
            '#description').innerHTML = eventit[i].Description.intro;
        const address = `https://www.google.com/maps/dir/?api=1&origin=${crd.latitude},${crd.longitude}
        &destination=${koordinaatit.latitude},${koordinaatit.longitude}&travelmode=driving&dir_action=navigate`;

        document.querySelector('#navigoi a').href = address;
      });
    }
  });
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

function haeLatauspisteet(crd) {
  return fetch(
      `https://open-api.myhelsinki.fi/v1/events/`,
  ).
      then(function(vastaus) {
        return vastaus.json();
      }).
      then(function(eventit) {
        console.log(eventit[0].AddressInfo);
        return eventit;
      });
}

function LisaaMarker(crd, teksti, ikoni) {
  return L.marker([crd.latitude, crd.longitude], {icon: ikoni}).
      addTo(map).
      bindPopup(teksti);
}