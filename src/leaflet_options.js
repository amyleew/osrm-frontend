'use strict';

module.exports = {
  defaultView: {
    centerLat: 38.8995,
    centerLng: -77.0269,
    zoom: 13,
    waypoints: [],
    language: 'en'
  },

  services: [
   {
      label: 'Car (fastest)',
      path: '//router.project-osrm.org/viaroute'
   }
  ],

  layer: [
   {
     label: 'Mapbox Emerald',
     tileLayer: 'http://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}@2x.png?access_token=mapbox_access_token',
     attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="http://mapbox.com/map-feedback/">Improve this map</a>',
     maxZoom: 18
   },
   {
     label: 'Mapbox Streets',
     tileLayer: 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=mapbox_access_token',
     attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="http://mapbox.com/map-feedback/">Improve this map</a>',
     maxZoom: 18
   }
]

};
