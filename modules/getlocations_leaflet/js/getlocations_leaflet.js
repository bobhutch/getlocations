/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_leaflet module for Drupal 7
 * this is for googlemaps API version 3
 */

var getlocations_leaflet_map = [];
var getlocations_leaflet_markers = [];
var getlocations_leaflet_settings = [];
var getlocations_leaflet_overlays = [];
var getlocations_leaflet_layerscontrol = [];

(function ($) {

  function getlocations_leaflet_init() {

    // bail out
    if (typeof Drupal.settings.getlocations_leaflet === 'undefined') {
      return;
    }

    $.each(Drupal.settings.getlocations_leaflet, function (key, settings) {

      // functions
      // end functions

      // is there really a map?
      if ( $("#getlocations_leaflet_canvas_" + key).is('div') ) {

        var map_settings = settings.map_settings;
        var map_opts = settings.map_opts;
        var map_layers = settings.map_layers;
        var icons = settings.icons;
        getlocations_leaflet_markers[key] = {};
        getlocations_leaflet_markers[key].coords = {};
        getlocations_leaflet_markers[key].lids = {};
        getlocations_leaflet_markers[key].cat = {};
        getlocations_leaflet_settings[key] = settings;
        getlocations_leaflet_overlays[key] = {};
        getlocations_leaflet_layerscontrol[key] = {};

        getlocations_leaflet_map[key] = new L.Map('getlocations_leaflet_canvas_' + key, map_opts);

        // layers
        var layers = {};
        for (var lkey in map_layers) {
          var layer = map_layers[lkey];
          var map_layer = new L.TileLayer(layer.urlTemplate);
          map_layer._leaflet_id = lkey;
          if (layer.options) {
            for (var option in layer.options) {
              map_layer.options[option] = layer.options[option];
            }
          }
          layers[lkey] = map_layer;
          //getlocations_leaflet_map[key].addLayer(map_layer);
          map_layer.addTo(getlocations_leaflet_map[key]);
        }

        // Zoom control
        if (map_settings.zoomControl && map_settings.zoomcontrolposition) {
          var zoomopts = {position: map_settings.zoomcontrolposition};
          getlocations_leaflet_map[key].addControl(new L.Control.Zoom(zoomopts));
        }
        // Attribution control
        if (map_settings.attributionControl && map_settings.attributioncontrolposition) {
          var attributionopts = {position: map_settings.attributioncontrolposition};
          var attribcontrol = new L.Control.Attribution(attributionopts)
          getlocations_leaflet_map[key].addControl(attribcontrol);
          attribcontrol.addAttribution(map_layers.earth.options.attribution);
        }
        // Scale control
        if (map_settings.scaleControl) {
          var scaleopts = {};
          if (map_settings.scalecontrolposition) {
            scaleopts.position = map_settings.scalecontrolposition;
          }
          if (map_settings.scalecontrolunits) {
            if (map_settings.scalecontrolunits == 'metric') {
              scaleopts.metric = true;
              scaleopts.imperial = false;
            }
            else if (map_settings.scalecontrolunits == 'imperial') {
              scaleopts.metric = false;
              scaleopts.imperial = true;
            }
          }
          getlocations_leaflet_map[key].addControl(new L.Control.Scale(scaleopts));
        }

        // latlons data
        if (settings.datanum > 0) {

          var categories = {};
          if (map_settings.category_showhide_buttons) {
            categories = (map_settings.categories ? map_settings.categories : {});
          }

          var Markers = [];
          if (map_settings.markercluster) {
            if (map_settings.category_showhide_buttons) {
              for (var c in categories) {
                Markers[c] = L.markerClusterGroup(map_settings.markerclusteroptions);
              }
            }
            else {
              Markers['loc'] = L.markerClusterGroup(map_settings.markerclusteroptions);
            }
          }
          else {
            if (map_settings.category_showhide_buttons) {
              for (var c in categories) {
                Markers[c] = new L.LayerGroup();
              }
            }
            else {
              Markers['loc'] = new L.LayerGroup();
            }
          }

          // loop over latlons
          for (var i = 0; i < settings.latlons.length; i++) {
            var latlon = settings.latlons[i];
            var lat           = latlon[0];
            var lon           = latlon[1];
            var entity_key    = latlon[2];
            var entity_id     = latlon[3];
            var glid          = latlon[4];
            var title         = latlon[5];
            var markername    = latlon[6];
            var markeraction  = latlon[7];
            var cat           = latlon[8];

            // check for duplicates
            var hash = lat + lon;
            if (getlocations_leaflet_markers[key].coords[hash] == null) {
              getlocations_leaflet_markers[key].coords[hash] = 1;
            }
            else {
              // we have a duplicate
              // 10000 constrains the max, 0.0001 constrains the min distance
              m1 = (Math.random() /10000) + 0.0001;
              // randomise the operator
              m2 = Math.random();
              if (m2 > 0.5) {
                lat = parseFloat(lat) + m1;
              }
              else {
                lat = parseFloat(lat) - m1;
              }
              m1 = (Math.random() /10000) + 0.0001;
              m2 = Math.random();
              if (m2 > 0.5) {
                lon = parseFloat(lon) + m1;
              }
              else {
                lon = parseFloat(lon) - m1;
              }
            }

            // make markers
            var latLng = new L.LatLng(lat, lon);
            var icon = '';
            if (markername) {
              icon = icons[markername];
            }
            if (icon) {
              var thisIcon = new L.Icon({iconUrl: icon.iconUrl});

              // override applicable marker defaults
              if (icon.iconSize) {
                thisIcon.options.iconSize = new L.Point(parseInt(icon.iconSize.x, 10), parseInt(icon.iconSize.y, 10));
              }
              if (icon.iconAnchor) {
                thisIcon.options.iconAnchor = new L.Point(parseFloat(icon.iconAnchor.x, 10), parseFloat(icon.iconAnchor.y, 10));
              }
              if (icon.popupAnchor) {
                thisIcon.options.popupAnchor = new L.Point(parseFloat(icon.popupAnchor.x, 10), parseFloat(icon.popupAnchor.y, 10));
              }
              if (icon.shadowUrl !== undefined) {
                thisIcon.options.shadowUrl = icon.shadowUrl;
                if (icon.shadowSize) {
                  thisIcon.options.shadowSize = new L.Point(parseInt(icon.shadowSize.x, 10), parseInt(icon.shadowSize.y, 10));
                }
                if (icon.shadowAnchor) {
                  thisIcon.options.shadowAnchor = new L.Point(parseInt(icon.shadowAnchor.x, 10), parseInt(icon.shadowAnchor.y, 10));
                }
              }
              Marker = new L.Marker(latLng, {icon: thisIcon});
            }
            else {
              Marker = new L.Marker(latLng);
            }
            // tooltip
            if (title) {
              Marker.options.title = title;
            }
            // markeraction
            if (markeraction && markeraction.type && markeraction.data) {
              if (markeraction.type == 'popup') {
                Marker.bindPopup(markeraction.data);
              }
              else if (markeraction.type == 'link') {
                getlocations_leaflet_do_link(Marker, markeraction.data);
              }
            }
            else {
              Marker.options.clickable = false;
            }

            // add the marker to the group(s)
            if (map_settings.category_showhide_buttons && cat) {
              for (var c in categories) {
                if (cat == c) {
                  Markers[c].addLayer(Marker);
                }
              }
            }
            else {
              Markers['loc'].addLayer(Marker);
            }

            // add marker to getlocations_leaflet_markers
            // still experimental
            getlocations_leaflet_markers[key].lids[glid] = Marker;

          } // end latlons

          // add the markers to the map
          if (map_settings.category_showhide_buttons) {
            for (var c in categories) {
              getlocations_leaflet_map[key].addLayer(Markers[c]);
            }
          }
          else {
            getlocations_leaflet_map[key].addLayer(Markers['loc']);
          }

          // set up overlays
          if (map_settings.category_showhide_buttons) {
            for (var c in categories) {
              getlocations_leaflet_overlays[key][categories[c]] = Markers[c];
            }
          }
          else if (map_settings.layercontrol_mark_ov) {
            getlocations_leaflet_overlays[key][map_settings.layercontrol_mark_ov_label] = Markers['loc'];
          }

        } // end datanum > 0

        if (settings.datanum > 1) {
          // minmaxes will apply when there are more than one marker on the map
          var minmaxes = (map_settings.minmaxes ? map_settings.minmaxes : false);
          if (minmaxes) {
            var mmarr = minmaxes.split(',');
            var sw = new L.LatLng(parseFloat(mmarr[2]), parseFloat(mmarr[3])),
              ne = new L.LatLng(parseFloat(mmarr[0]), parseFloat(mmarr[1])),
              bounds = new L.LatLngBounds(sw, ne).pad(0.1);
              getlocations_leaflet_map[key].fitBounds(bounds);
          }
        }

        // Layer control
        if (map_settings.layerControl) {
          var layeropts = {};
          if (map_settings.layercontrolposition) {
            var layeropts = {position: map_settings.layercontrolposition};
          }
          getlocations_leaflet_layerscontrol[key] = new L.Control.Layers(layers, getlocations_leaflet_overlays[key], layeropts);
          getlocations_leaflet_map[key].addControl(getlocations_leaflet_layerscontrol[key]);
        }

      } // end is there really a map?
    }); // end each setting loop
    $("body").addClass("getlocations-leaflet-maps-processed");

  } // end getlocations_leaflet_init

  function getlocations_leaflet_do_link(m, l) {
    m.on('click', function() {
      window.location = l;
    });
  }

  // gogogo
  Drupal.behaviors.getlocations_leaflet = {
    attach: function (context, settings) {
      if (! $(".getlocations-leaflet-maps-processed").is("body")) {
        getlocations_leaflet_init();
      }
    }
  };
}(jQuery));