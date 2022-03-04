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

// function to be used after location has been found.
function success(pos) {
  crd = pos.coords;
  map.setView([crd.latitude, crd.longitude], 12);

  const ownLocation = addMarker(crd, 'I am here', redIcon);
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

  const tags = `Culture and leisure%2CStudents%2CExhibitions%2CConcerts and clubs%2CEnvironment and nature`
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
            document.querySelector(
                '#name').innerHTML = events.data[i].name.fi;
            document.querySelector(
                '#address').innerHTML = events.data[i].location.address.street_address;
            document.querySelector(
                '#whereWhenDuration').innerHTML = events.data[i].event_dates.starting_day;
            document.querySelector(
                '#description').innerHTML = events.data[i].description.intro;
            const address = `https://www.google.com/maps/dir/?api=1&origin=${crd.latitude},${crd.longitude}
        &destination=${coordinates.latitude},${coordinates.longitude}&travelmode=driving&dir_action=navigate`;

            document.querySelector('#navigate a').href = address;
          });
          markerEvents.push(newMarker);
          map.addLayer(markerEvents[i]);
        }
      })
    } else {
      for(let i = 0; i< markerEvents.length; i++){
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
          document.querySelector(
              '#name').innerHTML = activities[i].name;
          document.querySelector(
              '#address').innerHTML = activities[i].location.address;
          document.querySelector(
              '#whereWhenDuration').innerHTML = '';
          document.querySelector(
              '#description').innerHTML = '';
          const address = `https://www.google.com/maps/dir/?api=1&origin=${crd.latitude},${crd.longitude}
        &destination=${coordinates.latitude},${coordinates.longitude}&travelmode=driving&dir_action=navigate`;

          document.querySelector('#navigate a').href = address;
        });
        markerActivities.push(newMarker);
        map.addLayer(markerActivities[i]);
      }
    })
  } else {
    for(let i = 0; i< markerActivities.length; i++){
      map.removeLayer(markerActivities[i]);
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
          document.querySelector(
              '#name').innerHTML = places.data[i].name.fi;
          document.querySelector(
              '#address').innerHTML = places.data[i].location.address.street_address;
          document.querySelector(
              '#whereWhenDuration').innerHTML = '';
          document.querySelector(
              '#description').innerHTML = '';
          destinationLat = coordinates.latitude;
          destinationLon = coordinates.longitude;


        });
        markerSights.push(newMarker);
        map.addLayer(markerSights[i]);
      }
      document.getElementById("nav").addEventListener('click', function(event){
        haeReitti({latitude: crd.latitude, longitude: crd.longitude}, {latitude: destinationLat, longitude: destinationLon});
      });
    })
  } else {
    for(let i = 0; i< markerSights.length; i++){
      map.removeLayer(markerSights[i]);
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

const apiOsoite = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
const proxy = 'https://cors-anywhere.herokuapp.com/';

// haetaan reitti lähtöpisteen ja kohteen avulla
function haeReitti(lahto, kohde) {
  // GraphQL haku
  const haku = `{
  plan(
    from: {lat: ${lahto.latitude}, lon: ${lahto.longitude}}
    to: {lat: ${kohde.latitude}, lon: ${kohde.longitude}}
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
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
    body: JSON.stringify({query: haku}), // GraphQL haku lisätään queryyn
  };

  // lähetetään haku
  fetch(apiOsoite, fetchOptions).then(function (vastaus) {
    return vastaus.json();
  }).then(function (tulos) {
    console.log(tulos.data.plan.itineraries[0].legs);
    const googleKoodattuReitti = tulos.data.plan.itineraries[0].legs;
    let wholeDistance = 0;
    let wholeDuration = 0;
    document.getElementById('print').classList.replace('hidden', 'visible');
    document.getElementById('print').innerHTML = '<h3>Reittiohjeet</h3>';


    for (let i = 0; i < googleKoodattuReitti.length; i++) {
      let color = '';
      let mode;
      switch (googleKoodattuReitti[i].mode) {
        case 'WALK':
          color = 'green';
          mode = "Kävely";
          break;
        case 'BUS':
          color = 'red';
          mode = "Bussi";
          break;
        case 'RAIL':
          color = 'cyan';
          mode = "Juna";
          break;
        case 'TRAM':
          color = 'magenta';
          mode = "Ratikka";
          break;
        default:
          color = 'blue';
          break;



      }
      const reitti = (googleKoodattuReitti[i].legGeometry.points);
      const pisteObjektit = L.Polyline.fromEncoded(reitti).getLatLngs(); // fromEncoded: muutetaan Googlekoodaus Leafletin Polylineksi
      L.polyline(pisteObjektit).setStyle({
        color
      }).addTo(map);
      wholeDistance += googleKoodattuReitti[i].distance / 1000;
      wholeDuration += googleKoodattuReitti[i].duration / 60;
      let distance = (googleKoodattuReitti[i].distance / 1000).toFixed(2);
      let kesto = Math.round(+googleKoodattuReitti[i].duration / 60);
          document.getElementById('print').innerHTML += `<h4>Vaihe ${i+1}:</h4><p>
${mode}</p>`;
      document.getElementById('print').innerHTML += `<p>${kesto} minuuttia</p>`
      document.getElementById('print').innerHTML += `<p>${distance} km</p>`

    }
    document.getElementById('print').innerHTML += `<br><p><strong>Matkan pituus yhteensä:</strong> ${(wholeDistance).toFixed(2)} km `
    document.getElementById('print').innerHTML += `<p><strong>Matkan kesto yhteensä:</strong> ${Math.round(wholeDuration)} minuuttia</p>`
    map.fitBounds([[lahto.latitude, lahto.longitude], [kohde.latitude, kohde.longitude]]);
  }).catch(function (e) {
    console.error(e.message);
  });
}
