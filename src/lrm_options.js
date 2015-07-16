'use strict';

var mapView = require('./leaflet_options');

module.exports = {
  lrm: {
    lineOptions: {
      styles: [
        {color: 'black', opacity: 0.35, weight: 8},
        {color: 'white', opacity: 0.3, weight: 6}
      ]
    },
    dragStyles: [
      {color: 'black', opacity: 0.35, weight: 9},
      {color: 'white', opacity: 0.8, weight: 7}
    ],
    summaryTemplate: '<div class="osrm-directions-summary"><h2>{name}</h2><h3>{distance}, {time}</h3></div>',
    containerClassName: 'dark pad2',
    alternativeClassName: 'osrm-directions-instructions',
    stepClassName: 'osrm-directions-step',
    geocodersClassName: 'osrm-directions-inputs',
    itineraryBuilder: 'osrm-directions-steps'
  },

  popup: {
    removeButtonClass: 'osrm-icon mapbox-close-light-icon',
    uturnButtonClass: 'osrm-icon mapbox-u-turn-icon',
    markerOptions: {
    }
  },

  tools: {
    popupWindowClass: 'fill-dark dark',
    popupCloseButtonClass: 'osrm-icon mapbox-close-icon',
    linkButtonClass: 'osrm-icon mapbox-link-icon',
    editorButtonClass: 'osrm-icon mapbox-editor-icon',
    josmButtonClass: 'osrm-icon mapbox-josm-icon',
    localizationButtonClass: 'osrm-icon mapbox-flag-icon',
    printButtonClass: 'icon printer',
    toolsContainerClass: 'fill-dark dark',
	language: mapView.defaultView.language
  }
};
