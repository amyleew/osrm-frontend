'use strict';

module.exports = {
  defaultView: {
    centerLat: 38.8995,
    centerLng: -77.0269,
    zoom: 13,
    waypoints: [],
    language: 'en',
    service: 'Car (fastest)',
    layer: MapboxEmerald
  },

  services: {
    'Car (fastest)': '//router.project-osrm.org/viaroute'
  },

  layer: {
    MapboxEmerald: [
      tileLayer: 'http://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}@2x.png?access_token=mapbox_access_token',
      attribution: '<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright">© OpenStreetMap</a> | <a href="http://mapbox.com/map-feedback/">Improve this map</a>',
      maxZoom: 18
    ]
  }

};
