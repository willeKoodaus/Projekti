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

//coordinates
let crd;
let destinationLat;
let destinationLon;

//array for the markers
let markerEvents = new Array();
let markerActivities = new Array();
let markerSights = new Array();

//icons for the map
const redIcon = L.divIcon({className: 'red-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});
const userIcon = L.icon({iconUrl: 'icons/user.png', iconSize: [25,25]});
const eventIcon = L.icon({iconUrl: 'icons/events.png', iconSize: [25,25]});;
const sportsIcon = L.icon({iconUrl: 'icons/naturesports.png', iconSize: [25,25]});;
const sightsIcon = L.icon({iconUrl: 'icons/sights.png', iconSize: [25,25]});;

// function to be used after location has been found.
function success(pos) {
  crd = pos.coords;
  map.setView([crd.latitude, crd.longitude], 12);

  const ownLocation = addMarker(crd, 'Olet tässä', userIcon);
  map.addLayer(ownLocation);
  ownLocation.openPopup();
}

// function for errors if location search failed
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// location search initiated
navigator.geolocation.getCurrentPosition(success, error, options);

// function for adding a marker to the map
function addMarker(crd, text, icon) {
  return L.marker([crd.latitude, crd.longitude], {icon: icon}).
      bindPopup(text);
}

// function for fetching the events from api.myhelsinki
function getEvents() {

  const tags = `Culture and leisure%2CStudents%2CExhibitions%2CConcerts and clubs%2CEnvironment and nature`;
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

// function for fetching the events from Lipas
function getActivities() {
  const proxy = 'https://api.allorigins.win/get?url=';
  const search = `http://lipas.cc.jyu.fi/api/sports-places?fields=location.coordinates.wgs84&fields=www&fields=name&fields=location.city.name&fields=location.address&typeCodes=4403&typeCodes=4404&&typeCodes=103&typeCodes=104&typeCodes=108&typeCodes=112&typeCodes=111&typeCodes=4405&typeCodes=4412&typeCodes=109&typeCodes=1130&typeCodes=4411&typeCodes=102&&typeCodes=3230&typeCodes=1110&typeCodes=3240&typeCodes=204&typeCodes=1520&typeCodes=1510&typeCodes=4402&typeCodes=3210&typeCodes=3220&typeCodes=3110&typeCodes=1130&cityCodes=91
`;
  const url = proxy + encodeURIComponent(search);
  return fetch(url).
      then(function(answer) {
        return answer.json();
      }).
      then(function(data) {
        console.log(JSON.parse(data.contents));
        const activities = JSON.parse(data.contents);
        return activities;
      });
}

// function for fetching the places from api.myhelsinki

function getPlaces() {
  const proxy = 'https://api.allorigins.win/get?url=';
  const search = `https://open-api.myhelsinki.fi/v2/places/?tags_search=sights`;
  const url = proxy + encodeURIComponent(search);
  return fetch(url).
      then(function(answer) {
        return answer.json();
      }).
      then(function(data) {
        console.log(JSON.parse(data.contents));
        const places = JSON.parse(data.contents);
        return places;
      });
}

const events = document.getElementById('events');

// eventlistener for tapahtumat checkbox for filtering purposes. When checked it fills the map with getEvents function, removes the markers when unchecked.
events.addEventListener('change', function(event) {
  if (events.checked) {
    getEvents(crd).then(function(events) {
      for (let i = 0; i < events.data.length; i++) {
        const text = events.data[i].name.fi;
        const coordinates = {
          latitude: events.data[i].location.lat,
          longitude: events.data[i].location.lon,
        };
        const newMarker = addMarker(coordinates, text, greenIcon);
        newMarker.on('click', function() {
          polylineGroup.clearLayers();
          document.getElementById('print').
              classList.
              replace('visible', 'hidden');

          const startDay = events.data[i].event_dates.starting_day.slice(8, 10);
          const startMonth = events.data[i].event_dates.starting_day.slice(5,
              7);
          const startYear = events.data[i].event_dates.starting_day.slice(0, 4);
          const eventStartTime = events.data[i].event_dates.starting_day.slice(
              11, 16);
          const endDay = events.data[i].event_dates.ending_day.slice(8, 10);
          const endMonth = events.data[i].event_dates.starting_day.slice(5, 7);
          const endYear = events.data[i].event_dates.starting_day.slice(0, 4);
          const eventEndTime = events.data[i].event_dates.ending_day.slice(11,
              16);
          document.querySelector(
              '#name').innerHTML = events.data[i].name.fi;
          document.querySelector(
              '#address').innerHTML = events.data[i].location.address.street_address;
          document.querySelector(
              '#whereWhenDuration').innerHTML = `<strong>Alkaa:</strong> ${startDay}.${startMonth}.${startYear} klo ${eventStartTime}<br><strong>Päättyy:</strong> ${endDay}.${endMonth}.${endYear} klo ${eventEndTime}`;
          document.querySelector(
              '#description').innerHTML = events.data[i].description.intro;
          destinationLat = coordinates.latitude;
          destinationLon = coordinates.longitude;

        });
        markerEvents.push(newMarker);
        map.addLayer(markerEvents[i]);
      }
      document.getElementById('nav').addEventListener('click', function(event) {
        getRoute({latitude: crd.latitude, longitude: crd.longitude},
            {latitude: destinationLat, longitude: destinationLon});
      });
    });
  } else {
    for (let i = 0; i < markerEvents.length; i++) {
      map.removeLayer(markerEvents[i]);
    }
    document.querySelector(
        '#name').innerHTML = '';
    document.querySelector(
        '#address').innerHTML = '';
    document.querySelector(
        '#whereWhenDuration').innerHTML = '';
    document.querySelector(
        '#description').innerHTML = '';
  }
});

const activities = document.getElementById('activities');

// eventlistener for ulkoilu ja urheilu checkbox for filtering purposes. When checked it fills the map with getActivities function, removes the markers when unchecked.
activities.addEventListener('change', function(event) {
  if (activities.checked) {
    getActivities(crd).then(function(activities) {
      for (let i = 0; i < activities.length; i++) {
        const text = activities[i].name;
        const coordinates = {
          latitude: activities[i].location.coordinates.wgs84.lat,
          longitude: activities[i].location.coordinates.wgs84.lon,
        };
        const newMarker = addMarker(coordinates, text, greenIcon);
        newMarker.on('click', function() {
          polylineGroup.clearLayers();
          document.getElementById('print').
              classList.
              replace('visible', 'hidden');
          document.querySelector(
              '#name').innerHTML = activities[i].name;
          document.querySelector(
              '#address').innerHTML = activities[i].location.address;
          document.querySelector(
              '#website').innerHTML = `<a href="${activities[i].www}" target="_blank">Lisätietoja</a>`;
          document.querySelector(
              '#description').innerHTML = '';
          destinationLat = coordinates.latitude;
          destinationLon = coordinates.longitude;

        });
        markerActivities.push(newMarker);
        map.addLayer(markerActivities[i]);
      }
      document.getElementById('nav').addEventListener('click', function(event) {
        getRoute({latitude: crd.latitude, longitude: crd.longitude},
            {latitude: destinationLat, longitude: destinationLon});
      });
    });
  } else {
    for (let i = 0; i < markerActivities.length; i++) {
      map.removeLayer(markerActivities[i]);
    }
    document.querySelector(
        '#name').innerHTML = '';
    document.querySelector(
        '#address').innerHTML = '';
    document.querySelector(
        '#website').innerHTML = '';
    document.querySelector(
        '#description').innerHTML = '';
  }
});

const places = document.getElementById('places');

// eventlistener for nähtävyydet checkbox for filtering purposes. When checked it fills the map with getPlaces function, removes the markers when unchecked.
places.addEventListener('change', function(event) {
  if (places.checked) {
    getPlaces(crd).then(function(places) {
      for (let i = 0; i < places.data.length; i++) {
        const text = places.data[i].name.fi;
        const coordinates = {
          latitude: places.data[i].location.lat,
          longitude: places.data[i].location.lon,
        };
        const newMarker = addMarker(coordinates, text, greenIcon);
        newMarker.on('click', function() {
          polylineGroup.clearLayers();
          document.getElementById('print').
              classList.
              replace('visible', 'hidden');
          document.querySelector(
              '#name').innerHTML = places.data[i].name.fi;
          document.querySelector(
              '#address').innerHTML = places.data[i].location.address.street_address;
          if (places.data[i].info_url.length > 0) {
            document.querySelector(
                '#website').innerHTML = `<a href="${places.data[i].info_url}" target="_blank">Lisätietoja</a>`;
          } else {
            document.querySelector(
                '#website').innerHTML = '';
          }
          document.querySelector(
              '#description').innerHTML = places.data[i].description.intro;
          destinationLat = coordinates.latitude;
          destinationLon = coordinates.longitude;

        });
        markerSights.push(newMarker);
        map.addLayer(markerSights[i]);
      }
      document.getElementById('nav').addEventListener('click', function(event) {
        getRoute({latitude: crd.latitude, longitude: crd.longitude},
            {latitude: destinationLat, longitude: destinationLon});
      });
    });
  } else {
    for (let i = 0; i < markerSights.length; i++) {
      map.removeLayer(markerSights[i]);
    }
    document.querySelector(
        '#name').innerHTML = '';
    document.querySelector(
        '#address').innerHTML = '';
    document.querySelector(
        '#website').innerHTML = '';
    document.querySelector(
        '#description').innerHTML = '';
  }
});

const apiAddress = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
const proxy = 'https://cors-anywhere.herokuapp.com/';
let polylineGroup = L.layerGroup();

// get the route info with the start and destination coordinates
function getRoute(start, destination) {
  polylineGroup.clearLayers();
  // GraphQL search
  const search = `{
  plan(
    from: {lat: ${start.latitude}, lon: ${start.longitude}}
    to: {lat: ${destination.latitude}, lon: ${destination.longitude}}
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
        trip {
          tripHeadsign
          routeShortName
        }
        legGeometry {
          points
        }
      }
    }
  }
}`;

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: search}), // GraphQL search is added to query
  };

  // the query is sent with fetch.
  fetch(apiAddress, fetchOptions).then(function(answer) {
    return answer.json();
  }).then(function(result) {
    console.log(result.data.plan.itineraries[0].legs);
    const googleFormattedRoute = result.data.plan.itineraries[0].legs;
    let wholeDistance = 0;
    let wholeDuration = 0;
    document.getElementById('print').classList.replace('hidden', 'visible');
    document.getElementById('print').innerHTML = '<h3>Reittiohjeet</h3>';

    for (let i = 0; i < googleFormattedRoute.length; i++) {
      let color = '';
      let mode;
      switch (googleFormattedRoute[i].mode) {
        case 'WALK':
          color = '#093A3E';
          mode = 'Kävele';
          break;
        case 'BUS':
          color = '#B24C63';
          mode = `Ota bussi <strong>${googleFormattedRoute[i].trip.routeShortName}</strong> (${googleFormattedRoute[i].trip.tripHeadsign}), matkan kesto`;
          break;
        case 'RAIL':
          color = '#357DED';
          mode = `Ota juna <strong>${googleFormattedRoute[i].trip.routeShortName}</strong> (${googleFormattedRoute[i].trip.tripHeadsign}), matkan kesto`;
          break;
        case 'TRAM':
          color = '#069E2D';
          mode = `Ota ratikka <strong>${googleFormattedRoute[i].trip.routeShortName}</strong> (${googleFormattedRoute[i].trip.tripHeadsign}), matkan kesto`;
          break;
        case 'SUBWAY':
          color = '#FDCA40';
          mode = `Ota metro <strong>${googleFormattedRoute[i].trip.routeShortName}</strong> (${googleFormattedRoute[i].trip.tripHeadsign}), matkan kesto`;
        default:
          color = '#44CFCB';
          break;

      }
      const route = (googleFormattedRoute[i].legGeometry.points);

      const polyline = L.Polyline.fromEncoded(route).getLatLngs(); // fromEncoded: Google format is transformed in to leaflet polyline.
      polylineGroup.addLayer(L.polyline(polyline).setStyle({
        color,
      }));
      polylineGroup.addTo(map);

      //variables for saving the route information

      const unixTimeStart = googleFormattedRoute[i].startTime;
      const startDate = new Date(unixTimeStart);
      const startTime = startDate.toLocaleTimeString(navigator.language,
          {hour: '2-digit', minute: '2-digit'});

      const unixTimeEnd = googleFormattedRoute[i].endTime;
      const endDate = new Date(unixTimeEnd);
      const endTime = endDate.toLocaleTimeString(navigator.language,
          {hour: '2-digit', minute: '2-digit'});

      wholeDistance += googleFormattedRoute[i].distance / 1000;
      wholeDuration += googleFormattedRoute[i].duration / 60;
      const distance = (googleFormattedRoute[i].distance / 1000).toFixed(2);
      const duration = Math.round(+googleFormattedRoute[i].duration / 60);

      //route information is printed on the website

      document.getElementById(
          'print').innerHTML += `<h4>Klo ${startTime}—${endTime}:</h4><p>
${mode} ${duration} minuuttia (${distance} km)</p>`;
    }
    document.getElementById(
        'print').innerHTML += `<br><p><strong>Matkan pituus yhteensä:</strong> ${(wholeDistance).toFixed(
        2)} km `;
    document.getElementById(
        'print').innerHTML += `<p><strong>Matkan kesto yhteensä:</strong> ${Math.round(
        wholeDuration)} minuuttia</p>`;
    map.fitBounds([
      [start.latitude, start.longitude],
      [destination.latitude, destination.longitude]]);
  }).catch(function(e) {
    console.error(e.message);
    document.getElementById('print').classList.replace('hidden', 'visible');
    document.getElementById(
        'print').innerHTML += '<p>Reittiohjeita tähän kohteeseen ei ole saatavilla.</p>';
  });
}