'use strict';


var Geocoder = require('leaflet-control-geocoder');
require('leaflet-routing-machine');

var options = require('./src/lrm_options');
var mapLayer = options.layer;
var mapView = require('./src/leaflet_options');

mapLayer = mapLayer.map(function(layer) {
  layer = L.tileLayer(layer.tileLayer, {id: layer.label});
  return layer;
});


var map = L.map('map', {
  center: [mapView.defaultView.centerLat, mapView.defaultView.centerLng], 
  zoom: mapView.defaultView.zoom,
  layers: mapLayer
});




L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}@2x.png?access_token=' + window.localStorage.getItem('mapbox_access_token')).addTo(map);

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