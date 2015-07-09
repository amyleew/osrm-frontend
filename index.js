'use strict';


var Geocoder = require('leaflet-control-geocoder');
require('leaflet-routing-machine');

var options = require('./src/lrm_options');
var mapView = require('./src/leaflet_options');
var mapLayer = mapView.layer;
var defaultLayer = 

/* .map is a method available to arrays */
mapLayer = mapLayer.reduce(function(title, layer) {
  title[layer.label] = L.tileLayer(layer.tileLayer, {id: layer.label});
  return title;
});

var map = L.map('map', {
  center: [mapView.defaultView.centerLat, mapView.defaultView.centerLng], 
  zoom: mapView.defaultView.zoom
});

L.tileLayer('https://{s}.tiles.mapbox.com/v4/'+mapView.defaultView.layer+'/{z}/{x}/{y}@2x.png?access_token=' + window.localStorage.getItem('mapbox_access_token'), {
	attribution: 'Maps by <a href="https://www.mapbox.com/about/maps/">MapBox</a>. ' +
		'Routes from <a href="http://project-osrm.org/">OSRM</a>, ' +
		'data uses <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a> license'
}).addTo(map);

L.control.layers(mapLayer).addTo(map);

/*

L.control.layers(
  mapLayer,
  postion: 'topright'
).addTo(map);

L.control(
  .layers(mapLayer),
  .postion('topright')
).addTo(map);

*/

L.control.scale().addTo(map);

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