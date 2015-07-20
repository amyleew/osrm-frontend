'use strict';

var Geocoder = require('leaflet-control-geocoder');
require('leaflet-routing-machine');
var options = require('./src/lrm_options');
var links = require('./src/links.js');
var mapView = require('./src/leaflet_options');
var tools = require('./src/tools');
var mapLayer = mapView.layer;

var parsedOptions = links.parse(window.location.search);
var viewOptions = L.extend(mapView.defaultView, parsedOptions);

/* .reduce is a method available to arrays:
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce */
mapLayer = mapLayer.reduce(function(title, layer) {
  /* pass vars in format for leaflet consumption */
  title[layer.label] = L.tileLayer(layer.tileLayer, {id: layer.label});
  return title;
});

/* Add the map class */
var map = L.map('map', {
  zoomControl: false
}).setView(viewOptions.center, viewOptions.zoom);

/* Tile default layer */
L.tileLayer('https://{s}.tiles.mapbox.com/v4/'+mapView.defaultView.layer+'/{z}/{x}/{y}@2x.png?access_token=' + window.localStorage.getItem('mapbox_access_token'), {
	attribution: 'Maps by <a href="https://www.mapbox.com/about/maps/">MapBox</a>. ' +
		'Routes from <a href="http://project-osrm.org/">OSRM</a>, ' +
		'data uses <a href="http://opendatacommons.org/licenses/odbl/">ODbL</a> license'
}).addTo(map);

/* Leaflet Controls */
var lrm = L.Routing.control(L.extend({
  language: viewOptions.language,
  units: viewOptions.units,
  serviceUrl: mapView.services[0].path
},
  L.extend(
    options.lrm)
  )).addTo(map);

// We need to do this the ugly way because of cyclic dependencies...
// lrm.getPlan().options.createMarker = markerFactory(lrm, options.popup);

var toolsControl = tools.control(lrm, L.extend({
  position: 'bottomleft',
  language: mapView.language
 }, options.tools)).addTo(map);

L.control.layers(mapLayer,{}, {
    position: 'bottomleft',
  }).addTo(map);

L.control.scale().addTo(map);

/* OSRM setup */
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
});

var control = L.Routing.control({
  routeWhileDragging: true,
  plan: plan,
  lineOptions: options.lrm.lineOptions,
  summaryTemplate: options.lrm.summaryTemplate,
  containerClassName: options.lrm.containerClassName,
  alternativeClassName: options.lrm.alternativeClassName,
  stepClassName: options.lrm.stepClassName
}).addTo(map);

// set viewOptions waypoints to update with map clicked waypoints after control


if (viewOptions.waypoints.length > 1) {
  control.spliceWaypoints(0, 1, viewOptions.waypoints[0].latLng);
  control.spliceWaypoints(control.getWaypoints().length - 1, 1, viewOptions.waypoints[1].latLng);
}

var start = true;
var end = false;

map.on('click', function(e) {
  console.log('mapclick');
  if(control.getWaypoints().length < 2) {
    mapChange(e);
  }
});


plan.on('waypointschanged',function(e) {
  console.log('plan');
  if(control.getWaypoints().length >= 2) {
    mapChange(e);
  }
});


function mapChange(e) {
  if (start) {
    end = true;
    start = false;
    control.spliceWaypoints(0, 1, e.latlng);
  } else if (end) {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);

    var linkOptions = toolsControl._getLinkOptions();
    // update waypoints with the new waypoints
    linkOptions.waypoints = plan._waypoints;

    // generate the link
    var getLink = links.format(window.location.href, linkOptions);
	var hashLink = getLink.split('?');
    console.log(hashLink);

    // we will them modify the url
	window.location.hash = hashLink[1];
  }
}




