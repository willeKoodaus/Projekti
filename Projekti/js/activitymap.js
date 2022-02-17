'use strict';

// leaflet.js -library is used to show position on the map (https://leafletjs.com/)
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// settings for location
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//icons for the map
const redIcon = L.divIcon({className: 'red-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

// function to be used after location has been found.
function success(pos) {
  const crd = pos.coords;
  map.setView([crd.latitude, crd.longitude], 13);

  const ownLocation = addMarker(crd, 'I am here', redIcon);
  ownLocation.openPopup();

  getEvents(crd).then(function(events) {
    for (let i = 0; i < events.data.length; i++) {
      const text = events.data[i].name.fi;
      const coordinates = {
        latitude: events.data[i].location.lat,
        longitude: events.data[i].location.lon,
      };
      const marker = addMarker(coordinates, text, greenIcon);
      marker.on('click', function() {
        document.querySelector(
            '#name').innerHTML = events.data[i].name.fi;
        document.querySelector(
            '#address').innerHTML = events.data[i].location.address.street_address;
        document.querySelector(
            '#whereWhenDuration').innerHTML = events.data[i].event_dates.starting_day;
        document.querySelector(
            '#description').innerHTML = events.data[i].description.intro;
        const address = `https://www.google.com/maps/dir/?api=1&origin=${crd.latitude},${crd.longitude}
        &destination=${Coordinates.latitude},${Coordinates.longitude}&travelmode=driving&dir_action=navigate`;

        document.querySelector('#navigate a').href = address;
      });
    }
  });
}

// function for errors if location search failed
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// location search initiated
navigator.geolocation.getCurrentPosition(success, error, options);

// function for fetching the events from api.myhelsinki
function getEvents() {
  const tags = `Culture and leisure%2CLibraries and services%2CLibraries%2CStudents%2CExhibitions%2CConcerts and clubs%2CEnvironment and nature`
  const proxy = 'https://api.allorigins.win/get?url=';
  const search = `https://open-api.myhelsinki.fi/v1/events/?tags_search=${tags}`;
  const url = proxy + encodeURIComponent(search);
  return fetch(url).
      then(function(answer) {
        return answer.json();
      }).
      then(function(data) {
        console.log(JSON.parse(data.contents));
        const events = JSON.parse(data.contents);
        return events;
      });
}
// function for adding a marker to the map
function addMarker(crd, text, icon) {
  return L.marker([crd.latitude, crd.longitude], {icon: icon}).
      addTo(map).
      bindPopup(text);
}