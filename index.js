'use strict';


var Geocoder = require('leaflet-control-geocoder');
require('leaflet-routing-machine');

var options = require('./src/lrm_options');
var mapView = require('./src/leaflet_options');
var mapLayer = mapView.layer;

/* .map is a method available to arrays */
mapLayer = mapLayer.map(function(layer) {
  layer = L.tileLayer(layer.tileLayer, {id: layer.label});
  // console.log(layer.label);
  // console.log(layer.options.id);
  // console.log(layer.tileLayer);
  // console.log(layer._url);
  // console.log(window.localStorage.getItem('mapbox_access_token'));
  return layer;
});

// console.log(mapLayer);

var map = L.map('map', {
  center: [mapView.defaultView.centerLat, mapView.defaultView.centerLng], 
  zoom: mapView.defaultView.zoom,
  layers: mapLayer
});

/*  Overlay tileLayers */
L.tileLayer(mapView.defaultView.layer + window.localStorage.getItem('mapbox_access_token'), {
	attribution: 'Maps by <a href="https://www.mapbox.com/about/maps/">MapBox</a>. ' +
		'Routes from <a href="http://project-osrm.org/">OSRM</a>, ' +
		'data uses <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a> license'
}).addTo(map);


L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}@2x.png?access_token=' + window.localStorage.getItem('mapbox_access_token')).addTo(map);


L.control.layers(mapLayer).addTo(map);


mapLayer.forEach(function(layer) {
  // console.log(layer.options.id);
});




var ReversablePlan = L.Routing.Plan.extend({
  createGeocoders: function() {
    var container = L.Routing.Plan.prototype.createGeocoders.call(this);
    return container;
  }
});

var plan = new ReversablePlan([], {
  geocoder: Geocoder.nominatim(),
  routeWhileDragging: true,
  position: 'topright',
  useZoomParameter: true,
  reverseWaypoints: true,
  dragStyles: options.lrm.dragStyles,
    geocodersClassName: options.lrm.geocodersClassName
  }),
  control = L.Routing.control({
      routeWhileDragging: true,
      plan: plan,
      lineOptions: options.lrm.lineOptions,
  summaryTemplate: options.lrm.summaryTemplate,
  containerClassName: options.lrm.containerClassName,
    alternativeClassName: options.lrm.alternativeClassName,
    stepClassName: options.lrm.stepClassName
}).addTo(map);

var start = true;
var end = false;

map.on('click', function(e) {
  if (start) {
    end = true;
    start = false;
    control.spliceWaypoints(0, 1, e.latlng);
  } else if (end) {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
  }
});