'use strict';

var Geocoder = require('leaflet-control-geocoder');
var LRM = require('leaflet-routing-machine');
var options = require('./src/lrm_options');
var links = require('./src/links');
var mapView = require('./src/leaflet_options');
var tools = require('./src/tools');
var mapLayer = mapView.layer;

var parsedOptions = links.parse(window.location.hash);
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
  zoomControl: false,
  dragging: true
}).setView(viewOptions.center, viewOptions.zoom);

/* Tile default layer */
L.tileLayer('https://{s}.tiles.mapbox.com/v4/'+mapView.defaultView.layer+'/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg', {
	attribution: 'Maps by <a href="https://www.mapbox.com/about/maps/">Mapbox</a>. ' +
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

function makeIcon(i) {
    var url = i == 0 ? 'images/marker_start.png' : 'images/marker_end.png';
    return L.icon({
        iconUrl: url,
        iconSize: [40, 42]
    });
}

var plan = new ReversablePlan([], {
  geocoder: Geocoder.nominatim(),
  routeWhileDragging: true,
  createMarker: function(i, wp) {
        var options = {
                draggable: this.draggableWaypoints,
                icon: makeIcon(i)
            },
            marker = L.marker(wp.latLng, options);
        return marker;
  },
  routeDragInterval: 2,
  addWaypoints: false,
  waypointMode: 'snap',
  position: 'topright',
  useZoomParameter: true,
  reverseWaypoints: true,
  dragStyles: options.lrm.dragStyles,
  geocodersClassName: options.lrm.geocodersClassName
});

var control = L.Routing.control({
  plan: plan,
  lineOptions: options.lrm.lineOptions,
  summaryTemplate: options.lrm.summaryTemplate,
  containerClassName: options.lrm.containerClassName,
  alternativeClassName: options.lrm.alternativeClassName,
  stepClassName: options.lrm.stepClassName
}).addTo(map);

var altRoute;

control.on('routesfound', function(e) {
    if (e.routes.length > 1) {
        altRoute = L.Routing.line(e.routes[1], options.lrm.altLineOptions);
        altRoute.addTo(map);
    }
});


control.on('routingstart', function(e) {
    if (map.hasLayer(altRoute)) {
        map.removeLayer(altRoute);
    }
})

// set waypoints from hash values
if (viewOptions.waypoints.length > 1) {
  control.setWaypoints(viewOptions.waypoints);
}

var mapClick = map.on('click', mapChange);
plan.on('waypointschanged', updateHash);

function mapChange(e) {

  var length = control.getWaypoints().filter(function(pnt) {
    return pnt.latLng;
  });

  length = length.length;

  if (!length) {
    control.spliceWaypoints(0, 1, e.latlng);
  } else {
    if (length === 1) length = length + 1;
    control.spliceWaypoints(length - 1, 1, e.latlng);
    updateHash();
    map.off('click');
  }

}

function updateHash() {
  var length = control.getWaypoints().filter(function(pnt) {
    return pnt.latLng;
  }).length;

  if (length < 2) return;

  var linkOptions = toolsControl._getLinkOptions();
  linkOptions.waypoints = plan._waypoints;

  var hash = links.format(window.location.href, linkOptions).split('?');
  window.location.hash = hash[1];

}





