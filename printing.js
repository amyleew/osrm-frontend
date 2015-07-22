"use strict";

var Geocoder = require('leaflet-control-geocoder');
var LRM = require('leaflet-routing-machine');
var itineraryBuilder = require('./src/itinerary_builder');
var createGeocoder = require('./src/geocoder');
var links = require('./src/links');
var options = require('./src/lrm_options');
var mapView = require('./src/leaflet_options');

var parsedOptions = links.parse(window.location.hash);
var viewOptions = L.extend(mapView.defaultView, parsedOptions);

var map = L.map('map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    touchZoom: false,
    doubleClickZoom: false
  }
  ).setView(parsedOptions.center, viewOptions.zoom);


var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v4/'+mapView.defaultView.layer+'/{z}/{x}/{y}@2x.png?access_token=' + window.localStorage.getItem('mapbox_access_token'), {
	attribution: 'Maps by <a href="https://www.mapbox.com/about/maps/">MapBox</a>. ' +
		'Routes from <a href="http://project-osrm.org/">OSRM</a>, ' +
		'data uses <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a> license'
}).addTo(map);


var printMap = L.Routing.control({
  waypoints: parsedOptions.waypoints,
  //routeWhileDragging: true,
  //geocoder: Geocoder.nominatim(),
}).addTo(map);


console.log('map.getSize().x = '+map.getSize().x);
console.log(L.Routing.itinerary({language: viewOptions.language}).onAdd());


/*
var osrm = L.Routing.osrm();
var itinerary = L.Routing.itinerary({language: viewOptions.language});
var itineraryContainer = itinerary.onAdd();
//console.log(itineraryContainer);
document.getElementById("instructions").appendChild(itineraryContainer);

osrm.route(viewOptions.waypoints, function(error, alts) {
  var altIdx = viewOptions.alternative ? viewOptions.alternative : 0,
      line = L.Routing.line(alts[altIdx], {}),
      bounds,
      i;
  line.addTo(map);
  map.fitBounds(line.getBounds());

  viewOptions.waypoints.map(function (wp) {
    L.marker(wp.latLng).addTo(map);
  });
  itinerary.setAlternatives(alts);
  itinerary.selectAlternative(altIdx);
}, null, {});
*/


